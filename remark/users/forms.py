from django.contrib import admin
from django import forms

from remark.crm.models import Person
from remark.crm.constants import OFFICE_TYPES

from .models import Account, User
from .constants import COMPANY_ROLES


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
