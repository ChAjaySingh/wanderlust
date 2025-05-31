// delete listing confirmation

const deleteBtn = document.querySelector(".delete-btn");
deleteBtn.addEventListener("click", (event) => {
  const confirmDelete = confirm(
    "Are you sure you want to delete this listing?"
  );
  if (!confirmDelete) {
    event.preventDefault(); // Prevent the default action if the user cancels
  }
});

// for executing form validation
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();
