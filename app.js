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
      data: { user },
      error
    } = await supabaseClient.auth.getUser();


    if (error) {
      console.error(
        "Auth check error:",
        error.message
      );
    }


    /* -----------------------------------------------------
       FIND LOGIN AND REGISTER LINKS
    ----------------------------------------------------- */

    const loginLinks =
      document.querySelectorAll(
        'a[href="login.html"]'
      );

    const registerLinks =
      document.querySelectorAll(
        'a[href="register.html"]'
      );


    /* =====================================================
       USER IS LOGGED IN
    ===================================================== */

    if (user) {

      /* Hide Login links */
      loginLinks.forEach(link => {
        link.style.display = "none";
      });


      /* Hide Create Account links */
      registerLinks.forEach(link => {
        link.style.display = "none";
      });


      /* ---------------------------------------------------
         CHECK USER PROFILE
      --------------------------------------------------- */

      let profile = null;


      const {
        data,
        error: profileError
      } = await supabaseClient
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .single();


      if (!profileError) {
        profile = data;
      }


      /* ---------------------------------------------------
         FIND NAVIGATION
      --------------------------------------------------- */

      let nav = null;


      if (loginLinks.length > 0) {

        nav =
          loginLinks[0].parentElement;

      } else if (registerLinks.length > 0) {

        nav =
          registerLinks[0].parentElement;

      } else {

        /*
          Try common navigation selectors
        */

        nav =
          document.querySelector("nav");

      }


      if (!nav) {
        return;
      }


      /* ---------------------------------------------------
         CREATE ACCOUNT LINK
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
         ADMIN DASHBOARD LINK
      --------------------------------------------------- */

      if (
        profile &&
        profile.role === "admin" &&
        !document.querySelector(
          'a[href="admin.html"]'
        )
      ) {

        const adminLink =
          document.createElement("a");

        adminLink.href =
          "admin.html";

        adminLink.textContent =
          "Admin Dashboard";

        adminLink.id =
          "authAdminLink";

        nav.appendChild(adminLink);

      }


      /* ---------------------------------------------------
         LOGOUT LINK
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


            logoutLink.style.pointerEvents =
              "none";


            const {
              error
            } =
              await supabaseClient.auth.signOut();


            if (error) {

              console.error(
                "Logout error:",
                error.message
              );

              alert(
                "Unable to log out. Please try again."
              );

              logoutLink.textContent =
                "Logout";

              logoutLink.style.pointerEvents =
                "auto";

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
       USER IS LOGGED OUT
    ===================================================== */

    else {

      /* Show Login links */
      loginLinks.forEach(link => {
        link.style.display = "";
      });


      /* Show Create Account links */
      registerLinks.forEach(link => {
        link.style.display = "";
      });


      /* Remove My Account */
      const accountLink =
        document.getElementById(
          "authAccountLink"
        );

      if (accountLink) {
        accountLink.remove();
      }


      /* Remove Admin Dashboard */
      const adminLink =
        document.getElementById(
          "authAdminLink"
        );

      if (adminLink) {
        adminLink.remove();
      }


      /* Remove Logout */
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
  function(event, session) {

    /*
      Small delay prevents conflicts with
      Supabase session updates.
    */

    setTimeout(
      function() {
        updateAuthNavigation();
      },
      100
    );

  }
);


/* =========================================================
   INITIAL AUTH CHECK
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    updateAuthNavigation();

  }
);
