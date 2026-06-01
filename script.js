(function () {
  var defaults = {
    fullName: 'Jillian Halley',
    professionalTitle: 'Senior Experience Consultant within Product Design at Slalom',
    contactEmail: 'jillian.merrill@slalom.com',
    location: 'Boston, MA',
    availability: 'Accepting select 2026 engagements',
    resumeUrl: '#',
    resumeLabel: 'Resume coming soon',
    linkedinUrl: '#',
    behanceUrl: '#',
    dribbbleUrl: '#',
    calendlyUrl: '#',
    capabilityViewMode: 'classic',
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

  var toField = document.querySelector('#to');
  if (toField) {
    toField.value = content.contactEmail;
  }

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

  var clientDaysNode = document.querySelector('[data-client-days]');
  if (clientDaysNode) {
    var clientStartDate = new Date(Date.UTC(2023, 9, 28));
    var now = new Date();
    var todayUtc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    var elapsedMs = todayUtc.getTime() - clientStartDate.getTime();
    var elapsedDays = Math.max(0, Math.floor(elapsedMs / 86400000));
    clientDaysNode.textContent = String(elapsedDays);
  }

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

  var skillsLab = document.querySelector('#skills-lab');
  var skillFilters = document.querySelectorAll('.skill-filter');
  var skillNodes = skillsLab ? skillsLab.querySelectorAll('.skill-node') : [];
  var skillTitle = document.querySelector('.skills-detail-title');
  var skillCopy = document.querySelector('.skills-detail-copy');

  function setActiveSkill(node) {
    if (!node || !skillTitle || !skillCopy) {
      return;
    }

    skillNodes.forEach(function (item) {
      item.classList.remove('is-active');
    });
    node.classList.add('is-active');
    skillTitle.textContent = node.dataset.skillLabel || node.textContent;
    skillCopy.textContent = node.dataset.skillDetail || '';
  }

  if (skillsLab && skillNodes.length) {
    window.requestAnimationFrame(function () {
      skillsLab.classList.add('is-ready');
    });

    setActiveSkill(skillNodes[0]);

    skillNodes.forEach(function (node) {
      node.addEventListener('mouseenter', function () {
        setActiveSkill(node);
      });
      node.addEventListener('focus', function () {
        setActiveSkill(node);
      });
      node.addEventListener('click', function () {
        setActiveSkill(node);
      });
    });

    if (!reducedMotion) {
      var labRect = null;
      var glowNode = document.createElement('span');
      var trailNode = document.createElement('span');
      var targetX = 0;
      var targetY = 0;
      var trailX = 0;
      var trailY = 0;
      var trailFrame = null;
      var glowHalf = 95;
      var trailHalf = 130;

      glowNode.className = 'skills-cursor-glow';
      trailNode.className = 'skills-cursor-trail';
      skillsLab.appendChild(trailNode);
      skillsLab.appendChild(glowNode);

      var updateLabRect = function () {
        labRect = skillsLab.getBoundingClientRect();
        glowHalf = glowNode.offsetWidth / 2;
        trailHalf = trailNode.offsetWidth / 2;
      };

      var paintTrail = function () {
        trailX += (targetX - trailX) * 0.2;
        trailY += (targetY - trailY) * 0.2;

        trailNode.style.transform =
          'translate3d(' +
          (trailX - trailHalf).toFixed(2) +
          'px, ' +
          (trailY - trailHalf).toFixed(2) +
          'px, 0)';

        trailFrame = window.requestAnimationFrame(paintTrail);
      };

      var ensureTrail = function () {
        if (!trailFrame) {
          trailFrame = window.requestAnimationFrame(paintTrail);
        }
      };

      updateLabRect();
      window.addEventListener('resize', updateLabRect);

      skillsLab.addEventListener('mouseenter', function () {
        skillsLab.classList.add('is-pointer-active');
      });

      skillsLab.addEventListener('mousemove', function (event) {
        if (!labRect) {
          updateLabRect();
        }

        var centerX = labRect.left + labRect.width / 2;
        var centerY = labRect.top + labRect.height / 2;
        var offsetX = (event.clientX - centerX) / labRect.width;
        var offsetY = (event.clientY - centerY) / labRect.height;
        var localX = event.clientX - labRect.left;
        var localY = event.clientY - labRect.top;

        targetX = localX;
        targetY = localY;
        if (!trailX && !trailY) {
          trailX = localX;
          trailY = localY;
        }

        skillsLab.style.setProperty('--cursor-x', localX.toFixed(2) + 'px');
        skillsLab.style.setProperty('--cursor-y', localY.toFixed(2) + 'px');
        glowNode.style.transform =
          'translate3d(' +
          (localX - glowHalf).toFixed(2) +
          'px, ' +
          (localY - glowHalf).toFixed(2) +
          'px, 0)';
        ensureTrail();

        skillNodes.forEach(function (node) {
          var depth = Number(node.dataset.depth || '0.2');
          node.style.transform =
            'translate3d(' +
            (offsetX * depth * 26).toFixed(2) +
            'px, ' +
            (offsetY * depth * 22).toFixed(2) +
            'px, 0)';
        });
      });

      skillsLab.addEventListener('mouseleave', function () {
        skillsLab.classList.remove('is-pointer-active');

        skillNodes.forEach(function (node) {
          node.style.transform = 'translate3d(0, 0, 0)';
        });

        if (trailFrame) {
          window.cancelAnimationFrame(trailFrame);
          trailFrame = null;
        }
      });
    }
  }

  if (skillFilters.length && skillNodes.length) {
    skillFilters.forEach(function (filter) {
      filter.addEventListener('click', function () {
        var active = filter.dataset.filter || 'all';

        skillFilters.forEach(function (node) {
          node.classList.remove('is-active');
        });
        filter.classList.add('is-active');

        var firstVisible = null;
        skillNodes.forEach(function (node) {
          var group = node.dataset.skillGroup;
          var visible = active === 'all' || group === active;
          node.classList.toggle('is-hidden', !visible);
          if (visible && !firstVisible) {
            firstVisible = node;
          }
        });

        setActiveSkill(firstVisible);
      });
    });
  }

  var capabilityCards = document.querySelectorAll('.capability-card[data-capability-title]');
  var capabilityTitle = document.querySelector('.capability-detail-title');
  var capabilityCopy = document.querySelector('.capability-detail-copy');
  var rolesPanel = document.querySelector('#roles-panel');
  var capabilityViewButtons = document.querySelectorAll('.capability-view-btn[data-capability-view]');
  var capabilityResetButton = document.querySelector('[data-capability-reset]');
  var defaultCapabilityView = content.capabilityViewMode === 'classic' ? 'classic' : 'inspiration';

  function setCapabilityView(mode, persist) {
    if (!rolesPanel) {
      return;
    }

    var view = mode === 'classic' ? 'classic' : 'inspiration';
    rolesPanel.setAttribute('data-view', view);

    capabilityViewButtons.forEach(function (button) {
      var active = button.dataset.capabilityView === view;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    if (persist) {
      try {
        window.localStorage.setItem('capabilityViewMode', view);
      } catch (error) {
        // no-op
      }
    }
  }

  function setCapability(card) {
    if (!card || !capabilityTitle || !capabilityCopy) {
      return;
    }

    capabilityCards.forEach(function (node) {
      node.classList.remove('is-active');
    });

    card.classList.add('is-active');
    capabilityTitle.textContent = card.dataset.capabilityTitle || '';
    capabilityCopy.textContent = card.dataset.capabilityDesc || '';
  }

  if (capabilityCards.length && capabilityTitle && capabilityCopy) {
    var initialView = defaultCapabilityView;
    if (capabilityViewButtons.length) {
      try {
        var storedView = window.localStorage.getItem('capabilityViewMode');
        if (storedView) {
          initialView = storedView;
        }
      } catch (error) {
        // no-op
      }
    }

    setCapabilityView(initialView, false);
    setCapability(capabilityCards[0]);

    var activeHintCard = null;

    function isClassicCapabilityView() {
      return rolesPanel && rolesPanel.getAttribute('data-view') === 'classic';
    }

    function hideCapabilityHint(card) {
      if (!card) {
        return;
      }
      card.classList.remove('show-hint');
      card.setAttribute('data-hint-pinned', 'false');
      card.setAttribute('aria-expanded', 'false');
      if (activeHintCard === card) {
        activeHintCard = null;
      }
    }

    function showCapabilityHint(card, pinned) {
      if (!card || !isClassicCapabilityView()) {
        return;
      }

      if (activeHintCard && activeHintCard !== card) {
        hideCapabilityHint(activeHintCard);
      }

      card.classList.add('show-hint');
      card.setAttribute('data-hint-pinned', pinned ? 'true' : 'false');
      card.setAttribute('aria-expanded', 'true');
      activeHintCard = card;
    }

    capabilityCards.forEach(function (card, index) {
      var hint = document.createElement('span');
      hint.className = 'capability-inline-hint';
      hint.id = 'capability-hint-' + String(index + 1);
      hint.setAttribute('role', 'tooltip');
      hint.textContent = card.dataset.capabilityDesc || '';
      card.appendChild(hint);
      card.setAttribute('aria-describedby', hint.id);
      card.setAttribute('aria-expanded', 'false');
      card.setAttribute('data-hint-pinned', 'false');
    });

    capabilityCards.forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        setCapability(card);
        showCapabilityHint(card, false);
      });
      card.addEventListener('mouseleave', function () {
        if (card.getAttribute('data-hint-pinned') !== 'true') {
          hideCapabilityHint(card);
        }
      });
      card.addEventListener('focus', function () {
        setCapability(card);
        showCapabilityHint(card, false);
      });
      card.addEventListener('blur', function () {
        if (card.getAttribute('data-hint-pinned') !== 'true') {
          hideCapabilityHint(card);
        }
      });
      card.addEventListener('click', function (event) {
        event.stopPropagation();
        setCapability(card);

        if (!isClassicCapabilityView()) {
          return;
        }

        var isPinned = card.getAttribute('data-hint-pinned') === 'true';
        if (isPinned) {
          hideCapabilityHint(card);
        } else {
          showCapabilityHint(card, true);
        }
      });
    });

    document.addEventListener('click', function () {
      if (activeHintCard) {
        hideCapabilityHint(activeHintCard);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && activeHintCard) {
        hideCapabilityHint(activeHintCard);
      }
    });
  }

  if (capabilityViewButtons.length) {
    capabilityViewButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        setCapabilityView(button.dataset.capabilityView, true);

        capabilityCards.forEach(function (card) {
          card.classList.remove('show-hint');
          card.setAttribute('data-hint-pinned', 'false');
          card.setAttribute('aria-expanded', 'false');
        });
      });
    });
  }

  if (capabilityResetButton) {
    capabilityResetButton.addEventListener('click', function () {
      try {
        window.localStorage.removeItem('capabilityViewMode');
      } catch (error) {
        // no-op
      }
      setCapabilityView(defaultCapabilityView, false);
    });
  }

  var contactForm = document.querySelector('.contact-form');
  var statusNode = document.querySelector('.form-status');

  if (contactForm && statusNode) {
    if (content.contactFormEndpoint) {
      contactForm.setAttribute('action', content.contactFormEndpoint);
      if (content.contactFormEndpoint.indexOf('mailto:') === 0) {
        contactForm.setAttribute('method', 'post');
        contactForm.setAttribute('enctype', 'text/plain');
        statusNode.textContent = 'Submitting opens an email draft in the default mail client.';
      } else {
        contactForm.setAttribute('method', 'post');
        statusNode.textContent = '';
      }
    } else {
      contactForm.addEventListener('submit', function (event) {
        event.preventDefault();
        statusNode.textContent = 'Message ready to send. Add a form endpoint in site-content.js to enable delivery.';
        contactForm.reset();
      });
    }
  }
})();
