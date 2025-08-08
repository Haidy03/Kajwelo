-------------------------If you want to use the navbar in your page ---------------------------------------------
1- <link rel="stylesheet" href="./css/navbar.css"/> 
2-  <div id="navbar"></div>      use this div in ur html page 
3- Add this script 
<script type="module">
    import { navbar } from './components/navbar.js';
    document.getElementById('navbar').innerHTML = navbar;
  </script>


-------------------------If you want to use the footer in your page ---------------------------------------------
1-<link rel="stylesheet" href="./css/footer.css">
2-  <div id="footer-placeholder"></div>
3- <script type="module">
    import { footer } from './components/footer.js';
    document.getElementById('footer-placeholder').innerHTML = footer;
  </script>
