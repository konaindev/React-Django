function getEmailsFromStr(str) {
  return str.split(",").map(i => i.trim());
}

function arrayDiff(arr1, arr2) {
  const set1 = new Set(arr1);
  for (const i of arr2) {
    set1.delete(i);
  }
  return [...set1.values()];
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
    const deletedEmails = arrayDiff(initialEmails, emails);
    if (deletedEmails.length) {
      let message =
        "Are you sure you want to remove this user from the email distribution list? \n\n";
      if (deletedEmails.length > 1) {
        message =
          "Are you sure you want to remove these users from the email distribution list? \n\n";
      }
      message += deletedEmails.join(", ");
      window.enable_submit_warning(message);
    } else {
      window.remove_submit_warning();
    }
  });
}

document.addEventListener("DOMContentLoaded", onEmailDistrChange);
