import json
import datetime

from django.contrib.auth import (
    views as auth_views,
    login as auth_login,
    forms as auth_forms,
    password_validation,
)
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponseRedirect, JsonResponse
from django.core.exceptions import ValidationError
from django.shortcuts import redirect
from django.utils import timezone
from django.urls import reverse

from rest_framework import exceptions, generics, mixins, status, viewsets
from rest_framework.views import APIView
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.response import Response

from remark.crm.models import Business, Office, Person
from remark.crm.constants import OFFICE_TYPES
from remark.geo.models import Address
from remark.geo.geocode import geocode
from remark.settings import LOGIN_URL
from remark.lib.views import ReactView, RemarkView

from .constants import COMPANY_ROLES, BUSINESS_TYPE, VALIDATION_RULES
from .forms import AccountCompleteForm
from .models import User


class CompleteAccountView(APIView):
    """
    Complete registration after creating password
    """
    permission_classes = [IsAuthenticated]

    office_options = [{"label": type[1], "value": type[0]} for type in OFFICE_TYPES]

    def get(self, request):
        return Response(
            {"office_types": self.office_options, "company_roles": COMPANY_ROLES}
        )

    def post(self, request):
        params = json.loads(request.body)
        form = AccountCompleteForm(params)
        if form.is_valid():
            data = form.data
            office_address = geocode(data["office_address"])
            address = Address.objects.get_or_create(
                formatted_address=office_address.formatted_address,
                street_address_1=office_address.street_address,
                city=office_address.city,
                state=office_address.state,
                zip_code=office_address.zip5,
                country=office_address.country,
                geocode_json=office_address.geocode_json,
            )[0]
            try:
                business = Business.objects.get(public_id=data["company"])
            except Business.DoesNotExist:
                business = Business(name=data["company"])
                business.save()
            for role in data["company_role"]:
                setattr(business, BUSINESS_TYPE[role], True)

            office = Office(
                office_type=data["office_type"],
                name=data["office_name"],
                address=address,
                business=business,
            )
            office.save()
            person = Person(
                first_name=data["first_name"],
                last_name=data["last_name"],
                role=data["title"],
                email=request.user.email,
                user=request.user,
                office=office,
            )
            person.save()
            response = Response({"success": True})
        else:
            response = Response(form.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return response


class CreatePasswordView(APIView):
    """
    Create password for a new account
    UI should login itself after setting password successfully
    """

    def post(self, request):
        if not request.user.is_anonymous:
            raise exceptions.APIException

        params = json.loads(request.body)
        user_id = params["user_id"]
        password = params["password"]

        try:
            user = User.objects.get(public_id=user_id)
        except User.DoesNotExist:
            raise exceptions.APIException

        if user.activated:
            raise exceptions.APIException

        try:
            password_validation.validate_password(password, user=user)
        except ValidationError as e:
            return Response({"errors": e.messages}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        user.set_password(password)
        user.activated = datetime.datetime.now(timezone.utc)
        user.is_active = True
        user.save()

        return Response({"success": True})


class PasswordRulesView(APIView):
    """
    - Get password validation rules
    - Validate password against rules
    """

    def get(self, request):
        validation_rules = [{"label": v["label"], "key": v["key"]} for v in VALIDATION_RULES]
        return Response({"rules": validation_rules})

    def post(self, request):
        params = json.loads(request.body)
        user_id = params["user_id"]
        password = params["password"]

        try:
            user = User.objects.get(public_id=user_id)
        except User.DoesNotExist:
            raise exceptions.APIException

        errors = {}
        for v in VALIDATION_RULES:
            try:
                password_validation.validate_password(
                    password, user=user, password_validators=v["validator"]
                )
            except ValidationError:
                errors[v["key"]] = True

        return Response({"errors": errors}, status=status.HTTP_200_OK)


class ChangePasswordView(APIView):
    """
    Change password for an existing logged in user
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        params = json.loads(request.body)
        form = auth_forms.PasswordChangeForm(request.user, params)
        if form.is_valid():
            user.set_password(params["new_password1"])
            user.save()
            response = Response({"success": True})
        else:
            response = Response(form.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return response
