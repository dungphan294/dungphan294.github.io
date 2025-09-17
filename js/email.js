const btn = document.getElementById("button");
const form = document.getElementById("form");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Fill hidden time field with current time
  const now = new Date();
  const formatted = now.toLocaleString();
  document.getElementById("time").value = formatted;

  emailjs.sendForm("default_service", "template_eyi7oa4", this).then(
    () => {
      alert("✅ Message sent!");
      form.reset();
    },
    (err) => {
      alert("❌ Error: " + JSON.stringify(err));
    }
  );
});
