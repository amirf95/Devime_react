import { useState } from "react";
import React from "react";

function Contact() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleSendEmail = async (e) => {
    e.preventDefault(); // prevent default form action

    const payload = {
      name: userName,
      email: userEmail,
      phone: userPhone,
      message: userMessage,
    };

    try {
      const response = await fetch("http://localhost:8000/send-email/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setSubmitError(false);
        setUserName("");
        setUserEmail("");
        setUserMessage("");
      } else {
        setSubmitSuccess(false);
        setSubmitError(true);
      }
    } catch (error) {
      setSubmitSuccess(false);
      setSubmitError(true);
      console.error("Error sending email:", error);
    }
  };

  return (
    <section className="page-section" id="contact">
      <div className="container">
        <div className="text-center">
          <h2 className="section-heading text-uppercase">Contact Us</h2>
          <h3 className="section-subheading text-muted">We’ll get back to you soon!</h3>
        </div>
        <form id="contactForm" onSubmit={handleSendEmail}>
          <div className="row align-items-stretch mb-5">
            <div className="col-md-6">
              <div className="form-group">
                <input
                  className="form-control"
                  id="name"
                  type="text"
                  placeholder="Your Name *"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control"
                  id="email"
                  type="email"
                  placeholder="Your Email *"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group mb-md-0">
                <input
                  className="form-control"
                  id="phone"
                  type="tel"
                  placeholder="Your Phone (optional)"
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group form-group-textarea mb-md-0">
                <textarea
                  className="form-control"
                  id="message"
                  placeholder="Your Message *"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {submitSuccess && (
            <div className="text-center text-success mb-3">
              🎉 Message sent successfully!
            </div>
          )}
          {submitError && (
            <div className="text-center text-danger mb-3">
              ❌ Error sending message. Please try again later.
            </div>
          )}

          <div className="text-center">
            <button className="message-button" id="submitButton" type="submit">
              Send Message
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Contact;
