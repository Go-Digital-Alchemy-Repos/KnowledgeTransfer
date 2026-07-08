const contactForm = document.querySelector("#contact-form");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = formData.get("name") || "";
  const company = formData.get("company") || "";
  const phone = formData.get("phone") || "";
  const email = formData.get("email") || "";
  const message = formData.get("message") || "";

  const body = [
    `Name: ${name}`,
    `Company: ${company}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    "",
    message,
  ].join("\n");

  const mailtoUrl = new URL("mailto:mike@godigitalalchemy.com");
  mailtoUrl.searchParams.set("subject", "Knowledge Transfer Inc. website inquiry");
  mailtoUrl.searchParams.set("body", body);

  window.location.href = mailtoUrl.toString();
});
