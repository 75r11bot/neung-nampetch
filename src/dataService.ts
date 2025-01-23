// Type definitions
type LanguageKey = "en" | "th";

interface ContactSection {
  title: string;
  description: string;
  address?: string;
  email?: string;
  phonNumber?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

interface ServiceItem {
  name: string;
  detail: string;
  icon: string;
}

interface ProjectItem {
  title: string;
  outcome: string;
  responsibilities: any[];
  technologies: string[];
  description: string;
  company: string;
  image: string;
  url: string;
}

export interface Data {
  servicesSection: any;
  experienceSection: any;
  languageSite: {
    items: string[]; // Language toggle buttons
  };
  navbarSection: {
    title: string; // Title for the navbar
    abbrev: string;
    menus: { [key: string]: { section?: string; name?: string } }; // Menu items
  };
  homeSection: {
    heading: {
      name: string;
      char: string;
      end: string;
    };
    subheading: string;
    introText: string[]; // Array of intro text lines
    buttonText: string;
    buttonLink: string;
  };
  aboutSection: {
    name: string;
    profession: string;
    introText: string[]; // Array of intro text lines
    services: {
      title: string;
      items: string[]; // Array of service items
    };
    whyChooseMe: {
      title: string;
      items: string[]; // Array of reasons to choose
    };
    contactText: string;
    imagePath: string;
  };
  skillSection: {
    title: string;
    description: string;
    skills: {
      name: string;
      percentage: number;
    }[];
  };
  projectsSection: {
    title: string;
    description: string;
    projects: ProjectItem[];
  };
  contactSection: ContactSection;
}

const updateElementText = (id: string, text: string, defaultText = "") => {
  const element = document.getElementById(id) as HTMLElement | null;
  if (element) {
    element.innerText = text || defaultText;
  }
};

const updateElementHTML = (id: string, html: string, defaultHTML = "") => {
  const element = document.getElementById(id) as HTMLElement | null;
  if (element) {
    element.innerHTML = html || defaultHTML;
  }
};

const updateElementAttribute = (
  id: string,
  attribute: string,
  value: string
) => {
  const element = document.getElementById(id) as HTMLElement | null;
  if (element) {
    element.setAttribute(attribute, value);
  }
};

const updateList = (
  id: string,
  items: string[],
  createListItem = (item: string) => item
) => {
  const listElem = document.getElementById(id) as HTMLElement | null;
  if (listElem) {
    listElem.innerHTML = items.map(createListItem).join("");
  }
};

const openProjectDialog = (project: ProjectItem) => {
  const dialog = document.getElementById("project-dialog") as HTMLElement;
  const title = document.getElementById("project-dialog-title") as HTMLElement;
  const company = document.getElementById(
    "project-dialog-company"
  ) as HTMLElement;
  const image = document.getElementById(
    "project-dialog-image"
  ) as HTMLImageElement;
  const description = document.getElementById(
    "project-dialog-description"
  ) as HTMLElement;
  const responsibilities = document.getElementById(
    "project-dialog-responsibilities"
  ) as HTMLElement;

  const technologies = document.getElementById(
    "project-dialog-technologies"
  ) as HTMLElement;

  if (dialog && title && company && image && description && technologies) {
    title.innerText = project.title;
    company.innerText = project.company;
    image.src = project.image;
    description.innerText = project.description;
    // Generate HTML for responsibilities
    const responsibilitiesList = project.responsibilities
      .map((tech) => `<li>${tech}</li>`)
      .join("");
    responsibilities.innerHTML = `<ul>${responsibilitiesList}</ul>`;

    // Generate HTML for technologies
    const techList = project.technologies
      .map((tech) => `<li>${tech}</li>`)
      .join("");
    technologies.innerHTML = `<ul>${techList}</ul>`;

    dialog.style.display = "block";
  }
};

const closeDialog = () => {
  const dialog = document.getElementById("project-dialog") as HTMLElement;
  if (dialog) {
    dialog.style.display = "none";
  }
};

export const renderContent = (
  data: Data,
  lang: LanguageKey,
  changeLanguage: (lang: LanguageKey) => Promise<void>,
  currentLanguage: LanguageKey
) => {
  // Language Site (Language Toggle)
  const languageToggleElem = document.getElementById(
    "language-button"
  ) as HTMLElement | null;
  if (languageToggleElem) {
    languageToggleElem.innerHTML = data.languageSite.items
      .map((item) => {
        const langCode = item === "Thai" || item === "ไทย" ? "th" : "en";
        const isActive = langCode === currentLanguage;
        return `<button class="js-lang-toggle ${
          isActive ? "active" : ""
        }" data-lang="${langCode}">${item}</button>`;
      })
      .join(" ");

    // Add Event Listener for language toggle buttons
    document.querySelectorAll(".js-lang-toggle").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const selectedLang = (event.target as HTMLElement).getAttribute(
          "data-lang"
        ) as LanguageKey;
        if (selectedLang && selectedLang !== currentLanguage) {
          await changeLanguage(selectedLang);
          // Optionally update `currentLanguage` if `changeLanguage` doesn't do it
        }
      });
    });
  }

  // Navbar Section
  const navbarTitleElem = document.getElementById(
    "navbar-title"
  ) as HTMLElement | null;
  const navbarMenuElem = document.getElementById(
    "navbar-menu"
  ) as HTMLElement | null;

  if (data.navbarSection && navbarTitleElem && navbarMenuElem) {
    navbarTitleElem.innerHTML = `${data.navbarSection.title}<span class="text-primary">${data.navbarSection.abbrev}</span>`;

    navbarMenuElem.innerHTML = Object.keys(data.navbarSection.menus)
      .map((key) => {
        const menuItem = data.navbarSection.menus[key];
        const isActive = window.location.hash === menuItem.section;
        return `<li><a href="${menuItem.section || "#"}" class="nav-link ${
          isActive ? "active" : ""
        }">${menuItem.name || "Menu Item"}</a></li>`;
      })
      .join("");
  } else {
    console.warn("Navbar section or its content is missing in data");
  }

  // Home Section
  if (data.homeSection) {
    updateElementHTML(
      "home-heading",
      `<strong>${data.homeSection.heading.name}<span class="text-primary"> ${data.homeSection.heading.char}</span> ${data.homeSection.heading.end}</strong>`
    );
    updateElementText("home-subheading", data.homeSection.subheading);
    updateElementHTML(
      "home-intro-text",
      data.homeSection.introText.join("<br><br>")
    );
    updateElementAttribute(
      "home-button",
      "href",
      data.homeSection.buttonLink || "#"
    );
    updateElementText("home-button", data.homeSection.buttonText);
  } else {
    console.warn("Home section or its content is missing in data");
  }

  // About Section
  if (data.aboutSection) {
    updateElementText("about-name", data.aboutSection.name);
    updateElementText("about-profession", data.aboutSection.profession);
    updateElementHTML(
      "about-intro-text",
      data.aboutSection.introText.join("<br><br>")
    );
    updateElementText(
      "about-services-title",
      data.aboutSection.services.title || "Services"
    );
    updateList(
      "about-services-list",
      data.aboutSection.services.items || [],
      (item) => `<li>${item}</li>`
    );
    updateElementText(
      "about-why-choose-title",
      data.aboutSection.whyChooseMe.title || "Why Choose Me"
    );
    updateList(
      "about-why-choose-list",
      data.aboutSection.whyChooseMe.items || [],
      (item) => `<li>${item}</li>`
    );
    updateElementText("about-contact-text", data.aboutSection.contactText);
    updateElementAttribute(
      "about-image",
      "src",
      data.aboutSection.imagePath || "default-image.png"
    );
  } else {
    console.warn("About section or its content is missing in data");
  }

  // Services Section
  if (data.servicesSection) {
    // Update the title and description for the services section
    updateElementText(
      "services-title",
      data.servicesSection.title || "Services"
    );
    updateElementText(
      "services-description",
      data.servicesSection.description || "The services I offer."
    );

    const servicesContainer = document.querySelector("#service-items");

    if (servicesContainer && Array.isArray(data.servicesSection.items)) {
      servicesContainer.innerHTML = ""; // Clear existing service items

      data.servicesSection.items.forEach(
        (serviceItem: ServiceItem, index: number) => {
          const serviceElem = document.createElement("div");
          serviceElem.className = "col-6 col-sm-6 col-md-6 col-lg-4 mb-4";

          serviceElem.innerHTML = `
        <div class="service text-center">
          <div class="gsap-reveal-hero mb-3">
            <span class="icon-service">
              <img src="${serviceItem.icon}" alt="${serviceItem.name}" class="img-fluid"/>
            </span>
          </div>
          <h3 class="gsap-reveal-hero">${serviceItem.name}</h3>
          <p class="gsap-reveal-hero">${serviceItem.detail}</p>
        </div>
      `;

          servicesContainer.appendChild(serviceElem);
        }
      );
    } else {
      console.warn("Services data is missing or not in the correct format.");
    }
  } else {
    console.warn("Services section or its content is missing in data");
  }

  // Experience Section
  if (data.experienceSection) {
    const experienceSectionElem = document.querySelector(
      ".main-timeline"
    ) as HTMLElement | null;

    if (experienceSectionElem) {
      updateElementText(
        "experience-title",
        data.experienceSection.title || "Work Experience"
      );

      experienceSectionElem.innerHTML = "";

      if (Array.isArray(data.experienceSection.items)) {
        data.experienceSection.items.forEach((item: any, index: number) => {
          const timelineDiv = document.createElement("div");
          timelineDiv.className = "timeline";

          const anchor = document.createElement("div");
          anchor.className = "timeline-content";

          const yearDiv = document.createElement("div");
          yearDiv.className = "timeline-year";
          yearDiv.innerText = item.period;

          const titleH3 = document.createElement("h3");
          titleH3.className = "title";
          titleH3.innerText = item.position;

          const companyP = document.createElement("p");
          companyP.innerHTML = `<strong>${item.company}</strong>`;

          const addressP = document.createElement("p");
          addressP.innerHTML = `<strong>${item.address}</strong>`;

          // Handle the description array
          const descriptionDiv = document.createElement("div");
          descriptionDiv.className = "description";

          item.description.forEach((desc: string, index: number) => {
            const descriptionP = document.createElement("p");
            descriptionP.innerText = `${index + 1}. ${desc}`;
            descriptionDiv.appendChild(descriptionP);
          });

          anchor.append(yearDiv, titleH3, companyP, addressP, descriptionDiv);
          timelineDiv.appendChild(anchor);
          experienceSectionElem.appendChild(timelineDiv);

          // Apply different colors based on the index
          const colors = [
            "#d82126",
            "#f47711",
            "#2cb257",
            "#2133d8",
            "#7E64A5",
          ];
          if (index < colors.length) {
            timelineDiv.style.setProperty("--main-color", colors[index]);
            companyP.style.setProperty("color", colors[index]);
          }
        });
      } else {
        console.warn("Experience section items is not an array");
      }
    } else {
      console.warn("Experience section element is missing");
    }
  } else {
    console.warn("Experience section or its content is missing in data");
  }

  // Skill Section
  if (data.skillSection) {
    // Ensure skill title and description are updated correctly
    updateElementText("skill-title", data.skillSection.title || "My Skillset");
    updateElementText(
      "skill-description",
      data.skillSection.description || "Skills overview"
    );

    const skillContainer = document.querySelector("#skills-items");

    if (skillContainer && Array.isArray(data.skillSection.skills)) {
      skillContainer.innerHTML = ""; // Clear existing content

      data.skillSection.skills.forEach((skillItem, index) => {
        const skillElem = document.createElement("div");
        skillElem.className = "col-6 col-sm-6 col-md-6 col-lg-3 text-center";
        skillElem.setAttribute("data-aos", "fade-up");
        skillElem.setAttribute("data-aos-delay", `${index * 100}`);

        skillElem.innerHTML = `
        <div class="progressbar" data-animate="false">
          <div class="circle" data-percent="${Number(skillItem.percentage)}">
            <div class="number"></div>
            <p class="caption">${skillItem.name}</p>
          </div>
        </div>
      `;

        skillContainer.appendChild(skillElem);
      });
    } else {
      console.warn("Skills data is missing or not in the correct format.");
    }
  } else {
    console.warn("Skill section or its content is missing in data");
  }

  // Projects Section
  if (data.projectsSection) {
    updateElementText(
      "projects-title",
      data.projectsSection.title || "Projects"
    );
    updateElementText(
      "projects-description",
      data.projectsSection.description || ""
    );

    const projectsContainer = document.querySelector("#projects-items");
    if (projectsContainer && Array.isArray(data.projectsSection.projects)) {
      projectsContainer.innerHTML = ""; // Clear existing content

      data.projectsSection.projects.forEach((projectItem, index) => {
        const projectElem = document.createElement("div");
        projectElem.className = "col-6 col-sm-6 col-md-6 col-lg-3";
        projectElem.setAttribute("data-aos", "fade-up");
        projectElem.setAttribute("data-aos-delay", `${index * 100}`);

        projectElem.innerHTML = `
        <div class="post-entry" data-project='${JSON.stringify(projectItem)}'>
          <a href="${projectItem.url}" class="thumb">
            <img src="${projectItem.image}" alt="image" class="img-fluid"/>
          </a>
          <h3><a href="${projectItem.url}">${projectItem.title}</a></h3>
          <div class="post-meta">
            ${projectItem.company}
          </div>
          <p class="items-projects-desc">${projectItem.description}</p>
        </div>
      `;

        projectElem.addEventListener("click", () =>
          openProjectDialog(projectItem)
        );
        projectsContainer.appendChild(projectElem);
      });
    } else {
      console.warn("Projects data is missing or not in the correct format.");
    }
  } else {
    console.warn("Projects section or its content is missing in data");
  }

  // Add event listener for closing the dialog
  const closeButton = document.querySelector(".dialog-close");
  if (closeButton) {
    closeButton.addEventListener("click", closeDialog);
  }

  // Utility function to update the text content of an element by its ID
  function updateElementText(elementId: string, text: string) {
    const element = document.getElementById(elementId);
    if (element) {
      element.textContent = text;
    }
  }

  // Contact Section
  if (data.contactSection) {
    updateElementText(
      "contact-title",
      data.contactSection.title || "Contact Information"
    );
    updateElementText(
      "contact-address",
      data.contactSection.address || "Address"
    );
    updateElementText("contact-email", data.contactSection.email || "Email");
    updateElementText(
      "contact-phone",
      data.contactSection.phonNumber || "Phone"
    );
    if (data.contactSection.coordinates) {
      const { latitude, longitude } = data.contactSection.coordinates;
      const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${latitude},${longitude}`;
      updateElementAttribute("map", "src", mapUrl);
    }
  } else {
    console.warn("Contact section or its content is missing in data");
  }
};
