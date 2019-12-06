from django.contrib import admin
from django.contrib.auth import password_validation
from django import forms

from remark.crm.models import Person
from remark.crm.constants import OFFICE_TYPES
from remark.geo.geocode import geocode

from .models import Account, User
from .constants import COMPANY_ROLES, PHONE_REGEX, ZIP_REGEX, COUNTRY_CODE_REGEX


class AccountForm(forms.ModelForm):
    class Meta:
        model = Account
        fields = "__all__"

    users = forms.ModelMultipleChoiceField(
        queryset=User.objects.all(),
        required=False,
        widget=admin.widgets.FilteredSelectMultiple(
            verbose_name='Users',
            is_stacked=False
        )
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance.pk:
            self.fields['users'].initial = self.instance.users.all()

    def save(self, *args, **kwrags):
        account = super().save(commit=False)
        account.save()

        if account.pk:
            account.users.update(account=None)
            self.cleaned_data['users'].update(account=account)

        return account


class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = "__all__"

    def save(self, commit=True):
        user = super().save(commit=False)
        if commit:
            user.save()
        return user


company_roles_values = [(role["value"], role["label"]) for role in COMPANY_ROLES]


class AccountCompleteForm(forms.Form):
    first_name = forms.CharField(max_length=255, required=True)
    last_name = forms.CharField(max_length=255, required=True)
    title = forms.CharField(max_length=255, required=False)
    company = forms.CharField(max_length=255, required=False)
    company_role = forms.MultipleChoiceField(
        choices=company_roles_values, required=True
    )
    office_address = forms.CharField(max_length=255, required=True)
    office_name = forms.CharField(max_length=255, required=True)
    office_type = forms.ChoiceField(choices=OFFICE_TYPES, required=True)
    terms = forms.BooleanField(required=True)


class AccountSecurityForm(forms.Form):
    email = forms.EmailField(max_length=254, required=True)

    old_password = forms.CharField(required=False)
    password = forms.CharField(required=False)
    confirm_password = forms.CharField(required=False)

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop("user", None)
        super(AccountSecurityForm, self).__init__(*args, **kwargs)

    def clean_old_password(self):
        password = self.cleaned_data["old_password"]
        if password and not self.user.check_password(password):
            raise forms.ValidationError("Password is not correct.")
        return password

    def clean_password(self):
        password = self.cleaned_data["password"]
        if password:
            password_validation.validate_password(password, user=self.user)
        return password

    def clean(self):
        cleaned_data = super().clean()
        required_msg = forms.Field.default_error_messages["required"]
        password = cleaned_data.get("password")
        if password:
            if "old_password" in cleaned_data and not cleaned_data["old_password"]:
                self.add_error("old_password", required_msg)
            if not cleaned_data["confirm_password"]:
                self.add_error("confirm_password", required_msg)
            elif password != cleaned_data["confirm_password"]:
                self.add_error("__all__", "New passwords don’t match.")
        return cleaned_data


class AccountProfileForm(forms.Form):
    avatar = forms.ImageField(required=False)
    first_name = forms.CharField(max_length=255, required=True)
    last_name = forms.CharField(max_length=255, required=True)
    title = forms.CharField(max_length=255, required=False)
    phone_country_code = forms.RegexField(COUNTRY_CODE_REGEX, required=False)
    phone = forms.RegexField(PHONE_REGEX, required=False)
    phone_ext = forms.RegexField(PHONE_REGEX, required=False)
    company = forms.CharField(max_length=255, required=True)
    company_roles = forms.MultipleChoiceField(
        choices=company_roles_values, required=True
    )
    office_street = forms.CharField(max_length=255, required=True)
    office_city = forms.CharField(max_length=255, required=True)
    office_state = forms.CharField(max_length=15, required=False)
    office_zip = forms.RegexField(ZIP_REGEX, required=True)
    office_name = forms.CharField(max_length=255, required=True)
    office_type = forms.ChoiceField(choices=OFFICE_TYPES, required=True)
    office_address = forms.CharField(max_length=255, required=False)

    def _check_address_attrs(self, address):
        required_attrs = [
            "formatted_address",
            "street_address",
            "city",
            "state",
            "zip5",
            "country",
            "geocode_json"
        ]
        for i in required_attrs:
            if not getattr(address, i):
                return False
        return True

    # def clean_office_address(self):
    #     office_address = geocode(self.cleaned_data["office_address"])
    #     if not office_address or not self._check_address_attrs(office_address):
    #         raise forms.ValidationError("Please enter a valid address.")
    #     return office_address
