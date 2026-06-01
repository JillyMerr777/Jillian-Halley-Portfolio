(function () {
  var defaults = {
    fullName: 'Jillian Halley',
    professionalTitle: 'Senior Experience Consultant within Product Design at Slalom',
    contactEmail: 'hello@yourdomain.com',
    location: 'Boston, MA',
    availability: 'Accepting select 2026 engagements',
    resumeUrl: '#',
    resumeLabel: 'Resume coming soon',
    linkedinUrl: '#',
    behanceUrl: '#',
    dribbbleUrl: '#',
    calendlyUrl: '#',
    contactFormEndpoint: ''
  };

  var content = Object.assign({}, defaults, window.siteContent || {});

  function setText(target, value) {
    document.querySelectorAll('[data-site-text="' + target + '"]').forEach(function (node) {
      node.textContent = value;
    });
  }

  function setLink(target, value) {
    document.querySelectorAll('[data-site-link="' + target + '"]').forEach(function (node) {
      node.setAttribute('href', value || '#');
      if (!value || value === '#') {
        node.setAttribute('aria-disabled', 'true');
        node.classList.add('is-placeholder-link');
      }
    });
  }

  setText('full-name', content.fullName);
  setText('professional-title', content.professionalTitle);
  setText('contact-email', content.contactEmail);
  setText('location', content.location);
  setText('availability', content.availability);
  setText('resume-label', content.resumeLabel);

  setLink('resume-url', content.resumeUrl);
  setLink('linkedin-url', content.linkedinUrl);
  setLink('behance-url', content.behanceUrl);
  setLink('dribbble-url', content.dribbbleUrl);
  setLink('calendly-url', content.calendlyUrl);

  var emailLinks = document.querySelectorAll('[data-site-link="contact-email"]');
  emailLinks.forEach(function (node) {
    node.setAttribute('href', 'mailto:' + content.contactEmail);
    node.textContent = content.contactEmail;
  });

  var menuButton = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.site-nav');

  if (menuButton && nav) {
    menuButton.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var year = new Date().getFullYear();
  document.querySelectorAll('.js-year').forEach(function (node) {
    node.textContent = String(year);
  });

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var revealNodes = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealNodes.length) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    revealNodes.forEach(function (node) {
      revealObserver.observe(node);
    });
  } else {
    revealNodes.forEach(function (node) {
      node.classList.add('is-visible');
    });
  }

  function animateValue(element, target, prefix, suffix) {
    var startTime = null;
    var duration = 1300;

    function step(timestamp) {
      if (!startTime) {
        startTime = timestamp;
      }
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(target * eased);
      element.textContent = prefix + String(value) + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  }

  var statNodes = document.querySelectorAll('.stat-number[data-value]');
  if (statNodes.length) {
    if ('IntersectionObserver' in window) {
      var statObserver = new IntersectionObserver(
        function (entries, observer) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var node = entry.target;
              var target = Number(node.dataset.value || '0');
              var prefix = node.dataset.prefix || '';
              var suffix = node.dataset.suffix || '';

              if (reducedMotion) {
                node.textContent = prefix + String(target) + suffix;
              } else {
                animateValue(node, target, prefix, suffix);
              }

              observer.unobserve(node);
            }
          });
        },
        { threshold: 0.45 }
      );

      statNodes.forEach(function (node) {
        statObserver.observe(node);
      });
    } else {
      statNodes.forEach(function (node) {
        node.textContent =
          (node.dataset.prefix || '') +
          String(Number(node.dataset.value || '0')) +
          (node.dataset.suffix || '');
      });
    }
  }

  if (!reducedMotion) {
    var stage = document.querySelector('.parallax-stage');
    if (stage) {
      var layers = stage.querySelectorAll('[data-parallax]');
      var ticking = false;

      var updateParallax = function () {
        var rect = stage.getBoundingClientRect();
        var viewport = window.innerHeight || document.documentElement.clientHeight;
        var progress = (viewport - rect.top) / (viewport + rect.height);

        layers.forEach(function (layer) {
          var depth = Number(layer.dataset.depth || '0.2');
          var offset = (progress - 0.5) * 140 * depth;
          layer.style.transform = 'translate3d(0, ' + offset.toFixed(2) + 'px, 0)';
        });

        ticking = false;
      };

      var onScroll = function () {
        if (!ticking) {
          window.requestAnimationFrame(updateParallax);
          ticking = true;
        }
      };

      updateParallax();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
    }
  }

  var contactForm = document.querySelector('.contact-form');
  var statusNode = document.querySelector('.form-status');

  if (contactForm && statusNode) {
    if (content.contactFormEndpoint) {
      contactForm.setAttribute('action', content.contactFormEndpoint);
      contactForm.setAttribute('method', 'post');
      statusNode.textContent = '';
    } else {
      contactForm.addEventListener('submit', function (event) {
        event.preventDefault();
        statusNode.textContent = 'Message ready to send. Add a form endpoint in site-content.js to enable delivery.';
        contactForm.reset();
      });
    }
  }
})();
