function getEmailsFromStr(str) {
  return str.split(",");
}

function onEmailDistrChange() {
  const field = document.querySelector("#id_email_distribution_list");
  if (!field) {
    return;
  }
  const emailsStr = field.value;
  if (!emailsStr) {
    return;
  }
  const initialEmails = getEmailsFromStr(emailsStr);
  field.addEventListener("change", function() {
    const emails = getEmailsFromStr(field.value);
    if (emails.length < initialEmails.length) {
      window.enable_submit_warning(
        "Are you sure you want to remove this user from the email distribution list?"
      );
    }
  });
}

document.addEventListener("DOMContentLoaded", onEmailDistrChange);
