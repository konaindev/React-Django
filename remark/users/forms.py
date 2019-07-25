from django.contrib import admin
from django import forms

from .models import Account, User
from remark.crm.models import Person


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

    person = forms.ModelChoiceField(
        queryset=Person.objects.all(),
        required=False,
        empty_label="None"
    )

    def save(self, commit=True):
        user = super().save(commit=False)
        if commit:
            user.save()
        return user
