-------------------------If you want to use the navbar in your page ---------------------------------------------
1- <link rel="stylesheet" href="../css/Finalhomepage.css" />

2-  <div id="navbar"></div>      use this div in ur html page 

3- Add this script 
<script type="module">
    import { navbar } from '../components/navbar.js';
    document.getElementById('navbar').innerHTML = navbar;
  </script>

* Do not forget to link font awesome 
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">


-------------------------If you want to use the footer in your page ---------------------------------------------

1-<link rel="stylesheet" href="../css/Finalhomepage.css">

2-  <div id="footer"></div>
3-  <script type="module">
    import { footer } from '../components/footer.js';
    document.getElementById('footer').innerHTML = footer;
  </script>   
