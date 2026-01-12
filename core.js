document.addEventListener('DOMContentLoaded',()=>{
    const menuToggle=document.getElementById('menuToggle');
    const navLinks=document.querySelector('.nav-links');
    const newsletterForm=document.getElementById('newsletterForm');
    const currentYear=document.getElementById('currentYear');
    
    if(currentYear)currentYear.textContent=new Date().getFullYear();
    
    function toggleMenu(){
        navLinks.classList.toggle('active');
        const expanded=navLinks.classList.contains('active');
        menuToggle.setAttribute('aria-expanded',expanded);
        menuToggle.querySelector('i').classList.toggle('fa-bars');
        menuToggle.querySelector('i').classList.toggle('fa-times');
    }
    
    function closeMenu(){
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded','false');
        menuToggle.querySelector('i').classList.add('fa-bars');
        menuToggle.querySelector('i').classList.remove('fa-times');
    }
    
    function validateEmail(email){
        const re=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showNotification(message,type){
        const notification=document.createElement('div');
        notification.className=`notification ${type}`;
        notification.textContent=message;
        notification.setAttribute('role','alert');
        notification.style.cssText='position:fixed;top:100px;right:20px;padding:15px 25px;border-radius:8px;color:white;font-weight:500;z-index:9999;animation:slideIn .3s ease-out;box-shadow:0 5px 15px rgba(0,0,0,0.2);';
        notification.style.backgroundColor=type==='success'?'#4CAF50':'#F44336';
        document.body.appendChild(notification);
        setTimeout(()=>{
            notification.style.animation='slideOut .3s ease-out';
            setTimeout(()=>document.body.removeChild(notification),300);
        },4000);
    }
    
    function initSmoothScroll(){
        document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
            anchor.addEventListener('click',function(e){
                const href=this.getAttribute('href');
                if(href==='#')return;
                e.preventDefault();
                const target=document.querySelector(href);
                if(target){
                    window.scrollTo({
                        top:target.offsetTop-80,
                        behavior:'smooth'
                    });
                    history.replaceState(null,null,href);
                }
            });
        });
    }
    
    function initIntersectionObserver(){
        const observer=new IntersectionObserver(entries=>{
            entries.forEach(entry=>{
                if(entry.isIntersecting){
                    entry.target.classList.add('animate-in');
                }
            });
        },{threshold:.1,rootMargin:'0px 0px -50px 0px'});
        document.querySelectorAll('.profile-card, .feature').forEach(el=>observer.observe(el));
    }
    
    function handleNewsletterSubmit(e){
        e.preventDefault();
        const emailInput=document.getElementById('email');
        const email=emailInput.value.trim();
        if(!validateEmail(email)){
            showNotification('Por favor, introduce un correo electrónico válido.','error');
            return;
        }
        emailInput.value='';
        showNotification('¡Gracias por suscribirte! Te mantendremos informado.','success');
    }
    
    function initPerformance(){
        if('connection' in navigator){
            const connection=navigator.connection;
            if(connection.saveData){
                document.querySelectorAll('img').forEach(img=>{
                    if(img.dataset.src){
                        img.src=img.dataset.src;
                    }
                });
            }
        }
    }
    
    function initSecurity(){
        document.querySelectorAll('a[target="_blank"]').forEach(link=>{
            if(!link.getAttribute('rel')){
                link.setAttribute('rel','noopener noreferrer');
            }
        });
        
        document.addEventListener('contextmenu',e=>{
            if(e.target.nodeName==='IMG'){
                e.preventDefault();
            }
        });
        
        document.addEventListener('keydown',e=>{
            if(e.ctrlKey && (e.key==='u'||e.key==='U'||e.key==='s'||e.key==='S')){
                e.preventDefault();
            }
        });
    }
    
    menuToggle.addEventListener('click',toggleMenu);
    document.querySelectorAll('.nav-links a').forEach(link=>link.addEventListener('click',closeMenu));
    if(newsletterForm)newsletterForm.addEventListener('submit',handleNewsletterSubmit);
    
    initSmoothScroll();
    initIntersectionObserver();
    initPerformance();
    initSecurity();
    
    window.addEventListener('scroll',()=>{
        const header=document.querySelector('.header');
        header.style.boxShadow=window.scrollY>50?'0 5px 20px rgba(0,0,0,0.1)':'0 5px 20px rgba(0,0,0,0.05)';
    });
    
    if(!document.querySelector('#notification-styles')){
        const style=document.createElement('style');
        style.id='notification-styles';
        style.textContent='@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes slideOut{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:0}}';
        document.head.appendChild(style);
    }
});