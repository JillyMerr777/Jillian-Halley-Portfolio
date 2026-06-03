# Content Entry Guide

Update only `site-content.js` to plug in real information later.

## Fields to update

- `fullName`: Display name used across the site.
- `professionalTitle`: Main professional title.
- `contactEmail`: Used for visible email links.
- `location`: Contact location text.
- `availability`: Availability text shown on contact page.
- `resumeUrl`: Link to PDF or hosted resume.
- `resumeLabel`: Button text for the resume link.
- `linkedinUrl`: LinkedIn profile URL.
- `behanceUrl`: Behance profile URL.
- `dribbbleUrl`: Dribbble profile URL.
- `calendlyUrl`: Scheduling link.
- `contactFormEndpoint`: Form endpoint (for example Formspree) for live form submission.

## Form endpoint examples

### Formspree

1. Create a Formspree form.
2. Copy the endpoint URL.
3. Set `contactFormEndpoint` to that URL in `site-content.js`.

### Keep as placeholder

If `contactFormEndpoint` is empty, the form stays in placeholder mode and shows a confirmation message without submitting.
