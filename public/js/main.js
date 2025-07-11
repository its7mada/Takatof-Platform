(function ($) {
  "use strict";

  // Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($("#spinner").length > 0) {
        $("#spinner").removeClass("show");
      }
    }, 1);
  };
  spinner();

  // Initiate the wowjs
  new WOW().init();

  // Fixed Navbar
  $(window).scroll(function () {
    if ($(window).width() < 992) {
      if ($(this).scrollTop() > 45) {
        $(".fixed-top").addClass("bg-white shadow");
      } else {
        $(".fixed-top").removeClass("bg-white shadow");
      }
    } else {
      if ($(this).scrollTop() > 45) {
        $(".fixed-top").addClass("bg-white shadow").css("top", -45);
      } else {
        $(".fixed-top").removeClass("bg-white shadow").css("top", 0);
      }
    }
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  // Testimonials carousel
  $(".testimonial-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1000,
    margin: 25,
    loop: true,
    center: true,
    dots: false,
    nav: true,
    navText: [
      '<i class="bi bi-chevron-left"></i>',
      '<i class="bi bi-chevron-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
      992: {
        items: 3,
      },
    },
  });
})(jQuery);

const loginUser = async (email, password) => {
  const loginEndpoint = "http://localhost:5501/api/auth/login";

  try {
    const response = await fetch(loginEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to login: ${response.statusText}`);
    }
    const AUTH_KEY = "AUTH_KEY";
    const data = await response.json();
    if (data.success) {
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(data.userData));
      console.log("Login successful:", data);
      if (data.userData.state === "admin") {
        window.location.href = "../admin-dashboard.html";
      } else {
        window.location.href = "/dashboard.html";
      }
    } else {
      console.error("Login failed:", data.message);
      const errorMessageElement = document.getElementById("error-message");
      errorMessageElement.textContent = "Username or password is incorrect";
      errorMessageElement.style.display = "block";
    }
  } catch (error) {
    console.error("Error during login:", error);
    const errorMessageElement = document.getElementById("error-message");
    errorMessageElement.textContent =
      "An error occurred. Please try again later.";
    errorMessageElement.style.display = "block";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("login-form").addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    loginUser(email, password);
  });
});
