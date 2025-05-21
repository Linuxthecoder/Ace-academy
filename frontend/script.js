document.addEventListener("DOMContentLoaded", function () {
    // Automatically detect base URL (local vs production)
    const baseURL = window.location.hostname === "localhost"
        ? "http://localhost:4000"
        : "https://www-aceacademy-com.onrender.com";

    // Function to get the current date and time
    const getTimestamp = () => {
        const now = new Date();
        return now.toISOString();
    };

    // Shared function to submit forms
    const handleFormSubmit = async (formData, messageDiv, form, successMessage) => {
        try {
            // Add timestamp
            formData.timestamp = getTimestamp();

            // Determine the correct endpoint
            const endpoint = formData.formType === "enrollment"
                ? `${baseURL}/submit`
                : `${baseURL}/submit-teacher-application`;

            console.log("Form type:", formData.formType);
            console.log("Posting to:", endpoint);

            // Send data using Axios
            const response = await axios.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log(`${successMessage} Success:`, response.data.message);

            // Show success message
            messageDiv.textContent = response.data.message;
            messageDiv.className = "message success";
            messageDiv.hidden = false;

            // Reset form
            form.reset();
        } catch (error) {
            console.error(`Error submitting ${successMessage.toLowerCase()}:`, error);
            messageDiv.textContent = "An error occurred. Please try again.";
            messageDiv.className = "message error";
            messageDiv.hidden = false;
        }
    };

    // Enrollment form logic
    const enrollmentForm = document.getElementById("enrollmentForm");
    if (enrollmentForm) {
        const enrollmentSubmitButton = enrollmentForm.querySelector("button[type='submit']");
        const enrollmentMessageDiv = document.getElementById("enrollmentMessage");

        enrollmentForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            enrollmentSubmitButton.textContent = "Submitting...";
            enrollmentSubmitButton.disabled = true;
            enrollmentMessageDiv.hidden = true;

            const formData = new FormData(enrollmentForm);
            const data = Object.fromEntries(formData.entries());
            data.formType = "enrollment";

            await handleFormSubmit(data, enrollmentMessageDiv, enrollmentForm, "Enrollment");

            enrollmentSubmitButton.textContent = "Submit";
            enrollmentSubmitButton.disabled = false;
        });
    }

    // Teacher application form logic
    const teacherForm = document.getElementById("teacherApplicationForm");
    if (teacherForm) {
        const teacherSubmitButton = teacherForm.querySelector("button[type='submit']");
        const teacherMessageDiv = document.getElementById("applicationMessage");

        teacherForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            teacherSubmitButton.textContent = "Submitting...";
            teacherSubmitButton.disabled = true;
            teacherMessageDiv.hidden = true;

            const formData = new FormData(teacherForm);
            const data = Object.fromEntries(formData.entries());
            data.formType = "teacherApplication";

            await handleFormSubmit(data, teacherMessageDiv, teacherForm, "Application");

            teacherSubmitButton.textContent = "Submit Application";
            teacherSubmitButton.disabled = false;
        });
    }
});
