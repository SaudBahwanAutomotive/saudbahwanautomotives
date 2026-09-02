/* =========================================================
   SAUDBAHWANAUTOMOTIVES
   SUPABASE CONFIGURATION
========================================================= */

const SUPABASE_URL =
  "https://xretkpptkpbjxbbuqrey.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_XrFWvnnoqoUM5sL5UcbQLg_Z7QhtfKT";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


/* =========================================================
   AUTH NAVIGATION
========================================================= */

async function updateAuthNavigation() {

  try {

    const {
      data: { user }
    } = await supabaseClient.auth.getUser();


    /* -----------------------------------------------------
       FIND AUTH NAVIGATION
    ----------------------------------------------------- */

    const loginLink =
      document.getElementById("loginNavLink");

    const registerLink =
      document.getElementById("registerNavLink");


    /* =====================================================
       LOGGED IN
    ===================================================== */

    if (user) {

      if (loginLink) {
        loginLink.style.display = "none";
      }

      if (registerLink) {
        registerLink.style.display = "none";
      }


      /* ---------------------------------------------------
         GET USER PROFILE
      --------------------------------------------------- */

      let profile = null;

      const {
        data,
        error
      } = await supabaseClient
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .single();

      if (!error) {
        profile = data;
      }


      /* ---------------------------------------------------
         FIND NAV
      --------------------------------------------------- */

      const nav =
        document.querySelector("nav");


      if (!nav) {
        return;
      }


      /* ---------------------------------------------------
         MY ACCOUNT
      --------------------------------------------------- */

      if (
        !document.getElementById(
          "authAccountLink"
        )
      ) {

        const accountLink =
          document.createElement("a");

        accountLink.href =
          "account.html";

        accountLink.id =
          "authAccountLink";

        accountLink.textContent =
          "My Account";

        nav.appendChild(accountLink);
      }


      /* ---------------------------------------------------
         ADMIN DASHBOARD
      --------------------------------------------------- */

      if (
        profile &&
        profile.role === "admin" &&
        !document.getElementById(
          "authAdminLink"
        )
      ) {

        const adminLink =
          document.createElement("a");

        adminLink.href =
          "admin.html";

        adminLink.id =
          "authAdminLink";

        adminLink.textContent =
          "Admin Dashboard";

        nav.appendChild(adminLink);
      }


      /* ---------------------------------------------------
         LOGOUT
      --------------------------------------------------- */

      if (
        !document.getElementById(
          "authLogoutLink"
        )
      ) {

        const logoutLink =
          document.createElement("a");

        logoutLink.href = "#";

        logoutLink.id =
          "authLogoutLink";

        logoutLink.textContent =
          "Logout";


        logoutLink.addEventListener(
          "click",
          async function(event) {

            event.preventDefault();

            logoutLink.textContent =
              "Logging out...";

            const {
              error
            } =
              await supabaseClient.auth.signOut();


            if (error) {

              alert(
                "Unable to log out. Please try again."
              );

              logoutLink.textContent =
                "Logout";

              return;
            }


            window.location.href =
              "index.html";

          }
        );


        nav.appendChild(logoutLink);
      }

    }


    /* =====================================================
       LOGGED OUT
    ===================================================== */

    else {

      if (loginLink) {
        loginLink.style.display = "";
      }

      if (registerLink) {
        registerLink.style.display = "";
      }


      /* Remove account */

      const accountLink =
        document.getElementById(
          "authAccountLink"
        );

      if (accountLink) {
        accountLink.remove();
      }


      /* Remove admin */

      const adminLink =
        document.getElementById(
          "authAdminLink"
        );

      if (adminLink) {
        adminLink.remove();
      }


      /* Remove logout */

      const logoutLink =
        document.getElementById(
          "authLogoutLink"
        );

      if (logoutLink) {
        logoutLink.remove();
      }

    }

  } catch (error) {

    console.error(
      "Authentication navigation error:",
      error
    );

  }

}


/* =========================================================
   AUTH STATE LISTENER
========================================================= */

supabaseClient.auth.onAuthStateChange(
  function() {

    setTimeout(
      updateAuthNavigation,
      100
    );

  }
);


/* =========================================================
   INITIAL CHECK
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    updateAuthNavigation();

  }
);
