import AOS from "aos";
import $ from "jquery";
import "owl.carousel";
import "waypoints/lib/noframework.waypoints";
import { renderContent } from "./dataService";
import { generateAndDownloadPDF } from "./pdfUtils";

// Initialize AOS
AOS.init({
  duration: 1000,
  easing: "ease-in-out",
  once: true,
});

type LanguageKey = "en" | "th";
let currentLanguage: LanguageKey = "en";
const cachedData: { [key in LanguageKey]?: any } = {}; // Caching language data

const siteMenuClone = () => {
  $(".js-clone-nav").each(function () {
    const $this = $(this);
    $this
      .clone()
      .attr("class", "site-nav-wrap")
      .appendTo(".site-mobile-menu-body");
  });

  setTimeout(() => {
    let counter = 0;
    $(".site-mobile-menu .has-children").each(function () {
      const $this = $(this);

      $this.prepend('<span class="arrow-collapse collapsed">');

      $this.find(".arrow-collapse").attr({
        "data-toggle": "collapse",
        "data-target": `#collapseItem${counter}`,
      });

      $this.find("> ul").attr({
        class: "collapse",
        id: `collapseItem${counter}`,
      });

      counter++;
    });
  }, 1000);

  $("body").on("click", ".arrow-collapse", function (e) {
    const $this = $(this);
    $this.toggleClass("active");
    e.preventDefault();
  });

  const debounce = (func: Function, wait: number) => {
    let timeout: number | null = null;
    return (...args: any[]) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = window.setTimeout(() => func(...args), wait);
    };
  };

  $(window).resize(
    debounce(function (this: HTMLElement) {
      const w = $(this).width() || 0;
      if (w > 768) {
        $("body").removeClass("offcanvas-menu");
      }
    }, 250)
  );

  $("body").on("click", ".js-menu-toggle", function (e) {
    const $this = $(this);
    e.preventDefault();

    $("body").toggleClass("offcanvas-menu");
    $this.toggleClass("active");
  });

  $("body").on("click", ".site-mobile-menu-close", function (e) {
    e.preventDefault();
    $("body").removeClass("offcanvas-menu");
    $(".js-menu-toggle").removeClass("active");
  });

  $(document).mouseup((e: JQuery.TriggeredEvent) => {
    const container = $(".site-mobile-menu");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      $("body").removeClass("offcanvas-menu");
      $(".js-menu-toggle").removeClass("active");
    }
  });

  $("body").on("click", ".js-lang-toggle", function (e) {
    e.preventDefault();
    const lang = $(this).data("lang") as LanguageKey;
    changeLanguage(lang);
  });
};

async function fetchData(url: string): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    console.log("Fetched data:", data);

    if (data && data.siteFooter) {
      cachedData[currentLanguage] = data;
      renderContent(data, currentLanguage, changeLanguage, currentLanguage);
      renderSiteTemplates(data);
    } else {
      console.error("Invalid data structure");
    }
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

async function changeLanguage(lang: LanguageKey) {
  if (lang !== currentLanguage) {
    currentLanguage = lang;

    if (cachedData[lang]) {
      renderContent(cachedData[lang], lang, changeLanguage, currentLanguage); // Use cached data if available
      renderSiteTemplates(cachedData[lang].siteFooter); // Render site footer based on cached data
    } else {
      await fetchData(`../data-${lang}.json`);
    }
  }
}

function renderSiteTemplates(data: any): void {
  if (!data) {
    console.error("No site data available.");
    return;
  }

  const { siteFooter, siteInfo } = data;

  // Set meta tags from siteInfo
  if (siteInfo) {
    updateMetaTag("author", siteInfo.name);
    updateFavicon(siteInfo.favicon);
    updateMetaTag("description", siteInfo.description || "");
    updateMetaTag("keywords", siteInfo.keywords || "");
  }

  // Render footer content
  if (siteFooter) {
    renderPrivacyPolicy(siteFooter.privacyPolicy);
    renderCookiePolicy(siteFooter.cookiePolicy);
    renderEducation(siteFooter.education);
    renderContactInfo(siteFooter.contactInfo);
  }
}

function updateMetaTag(name: string, content: string) {
  let metaTag = document.querySelector(
    `meta[name="${name}"]`
  ) as HTMLMetaElement;
  if (metaTag) {
    metaTag.content = content;
  } else {
    metaTag = document.createElement("meta") as HTMLMetaElement;
    metaTag.name = name;
    metaTag.content = content;
    document.head.appendChild(metaTag);
  }
}

function updateFavicon(href: string) {
  let link = document.querySelector(
    'link[rel="shortcut icon"]'
  ) as HTMLLinkElement;
  if (link) {
    link.href = href;
  } else {
    link = document.createElement("link") as HTMLLinkElement;
    link.rel = "shortcut icon";
    link.href = href;
    document.head.appendChild(link);
  }
}

function renderPrivacyPolicy(privacyPolicy: any) {
  if (!privacyPolicy) return;

  // Render privacy policy details
  updateElementContent("#privacy-title", privacyPolicy.title);
  updateElementContent("#privacy-content", privacyPolicy.content);
  renderPrivacyPolicyDetails("#privacy-collected", privacyPolicy.collected);
  renderPrivacyPolicyDetails("#privacy-use", privacyPolicy.use);
  renderPrivacyPolicyDetails("#privacy-sharing", privacyPolicy.sharing);
  renderPrivacyPolicyDetails("#privacy-rights", privacyPolicy.rights);
  renderPrivacyPolicyDetails("#privacy-update", privacyPolicy.update);
}

function renderPrivacyPolicyDetails(containerId: string, policy: any) {
  if (!policy) return;
  const container = document.querySelector(containerId);
  if (!container) return;

  container.innerHTML = "";
  if (policy.title) {
    const heading = document.createElement("h3");
    heading.innerText = policy.title;
    container.appendChild(heading);
  }
  if (policy.target) {
    const paragraph = document.createElement("p");
    paragraph.innerText = policy.target;
    container.appendChild(paragraph);
  }
  if (Array.isArray(policy.items)) {
    const list = document.createElement("ul");
    policy.items.forEach((item: string) => {
      const listItem = document.createElement("li");
      listItem.innerText = item;
      list.appendChild(listItem);
    });
    container.appendChild(list);
  }
}

function renderCookiePolicy(cookiePolicy: any) {
  if (!cookiePolicy) return;

  updateElementContent("#cookie-title", cookiePolicy.title);
  updateElementContent("#cookie-content", cookiePolicy.content);
  renderCookiePolicyDetails("#cookie-what", cookiePolicy.what);
  renderCookiePolicyDetails("#cookie-use", cookiePolicy.use);
  renderCookiePolicyDetails("#cookie-manage", cookiePolicy.manage);
  renderCookiePolicyDetails("#cookie-update", cookiePolicy.update);
}

function renderCookiePolicyDetails(containerId: string, policy: any) {
  if (!policy) return;
  const container = document.querySelector(containerId);
  if (!container) return;

  container.innerHTML = "";
  if (policy.title) {
    const heading = document.createElement("h3");
    heading.innerText = policy.title;
    container.appendChild(heading);
  }
  if (policy.target) {
    const paragraph = document.createElement("p");
    paragraph.innerText = policy.target;
    container.appendChild(paragraph);
  }

  if (Array.isArray(policy.items)) {
    const list = document.createElement("ul");
    policy.items.forEach((item: string) => {
      const listItem = document.createElement("li");
      listItem.innerText = item;
      list.appendChild(listItem);
    });
    container.appendChild(list);
  }
}

function renderContactInfo(contactInfo: any) {
  if (!contactInfo) return;

  updateElementContent("#contact-title", contactInfo.title);
  updateElementContent("#contact-address", contactInfo.address);
  updateElementContent("#social-title", contactInfo.titleSocial);

  const contactList = document.querySelector(".list-unstyled.links")!;
  contactList.innerHTML = contactInfo.contact
    .map((contact: any) => {
      return contact.tag === "email"
        ? `<li><a href="mailto:${contact.detail}">${contact.detail}</a></li>`
        : `<li><a href="tel://${contact.detail}">${contact.detail}</a></li>`;
    })
    .join("");

  const socialLinks = document.querySelector(".social")!;
  socialLinks.innerHTML = ""; // Clear existing social links
  contactInfo.social.forEach((social: { contact: string; icon: string }) => {
    if (social.contact) {
      const socialItem = document.createElement("li");
      socialItem.innerHTML = `<a href="${social.contact}"><span class="${social.icon}"></span></a>`;
      socialLinks.appendChild(socialItem);
    }
  });
}

function renderEducation(educationInfo: any) {
  if (!educationInfo && educationInfo.content) return;

  updateElementContent("#education-title", educationInfo.title, "N/A");
  console.log(educationInfo.content);
  updateElementHTML("#education-level", educationInfo.content?.level, "N/A");
  updateElementHTML("#education-degree", educationInfo.content?.degree, "N/A");
  updateElementHTML(
    "#education-faculty",
    educationInfo.content?.faculty,
    "N/A"
  );
  updateElementHTML("#education-major", educationInfo.content?.major, "N/A");
  updateElementHTML("#education-gpa", educationInfo.content?.gpa, "N/A");
  updateElementHTML(
    "#education-institution",
    educationInfo.content?.institution,
    "N/A"
  );
  updateElementHTML(
    "#education-graduation-year",
    educationInfo.content?.graduationYear,
    "N/A"
  );
}

function updateElementContent(id: any, content: any, defaultContent = "") {
  const element = document.querySelector(id) as HTMLElement | null;
  if (element) {
    element.innerHTML = content || defaultContent;
  }
}

const updateElementHTML = (id: string, html: string, defaultHTML = "") => {
  const element = document.querySelector(id) as HTMLElement | null;
  if (element) {
    element.innerHTML = html || defaultHTML;
  }
};

const downloadDialog = document.getElementById("download-dialog");
const closeDialogButton = document.getElementById("close-dialog");
const downloadForm = document.getElementById(
  "download-form"
) as HTMLFormElement | null;

function closeDownloadDialog() {
  if (downloadDialog) {
    console.log("Hiding download dialog");
    downloadDialog.classList.add("hidden");
  } else {
    console.error("Download dialog not found");
  }
}

if (closeDialogButton) {
  closeDialogButton.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("Close dialog button clicked");
    closeDownloadDialog();
  });
}

if (downloadForm) {
  downloadForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(downloadForm);

    const contactInfo = formData.get("contactInfo") as string;
    const reason = formData.get("reason") as string;
    const detailedReason = formData.get("detailedReason") as string;
    const language = formData.get("language") as LanguageKey;

    console.log({ contactInfo, reason, detailedReason, language });

    // Continue with your existing code
  });
}

document
  .getElementById("open-download-dialog")
  ?.addEventListener("click", () => {
    const dialog = document.getElementById("download-dialog");
    if (dialog) {
      dialog.classList.toggle("hidden"); // Toggle visibility for testing
    } else {
      console.error("Dialog element not found");
    }
  });

// document.addEventListener("DOMContentLoaded", () => {
//   console.log("DOM fully loaded and parsed");
//   console.log("DOM fully loaded and parsed");

//   // Handle download CV dialog
//   const openDialogButton = document.getElementById("open-download-dialog");

//   if (openDialogButton) {
//     openDialogButton.addEventListener("click", (event) => {
//       event.preventDefault();
//       console.log("Open dialog button clicked");
//       const dialog = document.getElementById("download-dialog");
//       if (dialog) {
//         dialog.classList.toggle("hidden");
//         console.log("Download dialog toggled");
//       } else {
//         console.error("Download dialog element not found");
//       }
//     });
//   } else {
//     console.error("Open dialog button not found");
//   }
//   fetchData(`../data-${currentLanguage}.json`);
//   siteMenuClone();
// });
// document.addEventListener("DOMContentLoaded", () => {
//   document.body.addEventListener("click", (event) => {
//     const target = event.target as HTMLElement;

//     if (target && target.id === "open-download-dialog") {
//       const downloadDialog = document.getElementById("download-dialog");
//       if (downloadDialog) {
//         downloadDialog.classList.remove("hidden");
//         console.log("Dialog visibility toggled");
//       } else {
//         console.error("Download dialog element not found");
//       }
//     }

//     if (target && target.id === "close-dialog") {
//       const downloadDialog = document.getElementById("download-dialog");
//       if (downloadDialog) {
//         downloadDialog.classList.add("hidden");
//         console.log("Dialog hidden");
//         console.log(downloadDialog.classList); // Check the class list
//       } else {
//         console.error("Download dialog element not found");
//       }
//     }
//   });
//   fetchData(`../data-${currentLanguage}.json`);
//   siteMenuClone();
// });

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;

    if (target?.id === "open-download-dialog") {
      const fileUrl = currentLanguage === "th" ? "cv/manus-cv-th.pdf" : "cv/manus-cv-en.pdf";
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = `CV_${currentLanguage.toUpperCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log("Download initiated:", fileUrl);
    }

    if (target?.id === "close-dialog") {
      const downloadDialog = document.getElementById("download-dialog");
      if (downloadDialog) {
        downloadDialog.classList.add("hidden");
        console.log("Dialog hidden");
      } else {
        console.error("Download dialog element not found");
      }
    }
  });

  fetchData(`../data-${currentLanguage}.json`);
  siteMenuClone();
});
