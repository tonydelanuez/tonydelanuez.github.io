---
title: About
layout: page
---
![Profile Image]({{ site.url }}/{{ site.picture }})

<pre id="show-json-from-git"></pre>

<script>
var url = 'https://raw.githubusercontent.com/tonydelanuez/tonydelanuez/main/README.md';
fetch(url)
.then(res => res.text())
.then((out) => {
  document.getElementById("show-json-from-git").innerText = out
})
.catch(err => { throw err });
</script>