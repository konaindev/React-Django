from django.core.validators import RegexValidator, int_list_validator


def string_list_validator(sep=',', message=None, code='invalid', allow_negative=False):
    regexp = r'(\r\n?|\n)+'
    return RegexValidator(regexp, message=message, code=code)


validate_linebreak_separated_numbers_list = int_list_validator(
    '\r\n',
    message='Enter only numbers separated by linebreaks.',
)


validate_linebreak_separated_strings_list = string_list_validator(
    '\r\n',
    message='Enter only characters separated by linebreaks.',
)
