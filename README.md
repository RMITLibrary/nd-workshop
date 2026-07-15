# nd-workshop (redirect)

This repository exists only to redirect visitors from the old URL to the new site.

Old URL:

- https://rmitlibrary.github.io/nd-workshop/

New URL:

- https://rmitlibrary.github.io/skills-for-nd-students/

## How it works

GitHub Pages is enabled for this repository, and the root of the repo contains a single `index.html` file with a meta refresh redirect:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Page moved</title>
  <meta http-equiv="refresh" content="0;url=https://rmitlibrary.github.io/skills-for-nd-students/">
  <link rel="canonical" href="https://rmitlibrary.github.io/skills-for-nd-students/">
</head>
<body>
  <p>This site has moved to
    <a href="https://rmitlibrary.github.io/skills-for-nd-students/">
      https://rmitlibrary.github.io/skills-for-nd-students/
    </a>.
  </p>
</body>
</html>
