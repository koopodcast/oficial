document.addEventListener('DOMContentLoaded',()=>{
    const menuToggle=document.getElementById('menuToggle');
    const navLinks=document.querySelector('.nav-links');
    const currentYear=document.getElementById('currentYear');
    const profileCards=document.querySelectorAll('.profile-card');
    
    if(currentYear)currentYear.textContent=new Date().getFullYear();
    
    const toggleMenu=()=>{
        navLinks.classList.toggle('active');
        const expanded=navLinks.classList.contains('active');
        menuToggle.setAttribute('aria-expanded',expanded);
        menuToggle.querySelector('i').classList.toggle('fa-bars');
        menuToggle.querySelector('i').classList.toggle('fa-times');
    };
    
    const closeMenu=()=>{
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded','false');
        menuToggle.querySelector('i').classList.add('fa-bars');
        menuToggle.querySelector('i').classList.remove('fa-times');
    };
    
    const initSmoothScroll=()=>{
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
                    if(navLinks.classList.contains('active'))closeMenu();
                }
            });
        });
    };
    
    const initIntersectionObserver=()=>{
        if(!('IntersectionObserver' in window))return;
        const observer=new IntersectionObserver(entries=>{
            entries.forEach(entry=>{
                if(entry.isIntersecting){
                    entry.target.style.animationPlayState='running';
                    observer.unobserve(entry.target);
                }
            });
        },{threshold:0.1,rootMargin:'0px 0px -50px 0px'});
        profileCards.forEach(card=>observer.observe(card));
    };
    
    const initScrollHeader=()=>{
        let lastScroll=0;
        window.addEventListener('scroll',()=>{
            const currentScroll=window.pageYOffset;
            const header=document.querySelector('.header');
            if(currentScroll<=0){
                header.style.boxShadow='none';
                header.style.transform='translateY(0)';
            }else if(currentScroll>lastScroll&&currentScroll>100){
                header.style.transform='translateY(-100%)';
            }else{
                header.style.transform='translateY(0)';
                header.style.boxShadow='0 5px 20px rgba(0,0,0,0.1)';
            }
            lastScroll=currentScroll;
        });
    };
    
    const initPerformance=()=>{
        if('connection' in navigator&&navigator.connection.saveData){
            document.querySelectorAll('img[data-src]').forEach(img=>{
                if(img.dataset.src)img.src=img.dataset.src;
            });
        }
        const now=performance.now();
        window.addEventListener('load',()=>{
            const loadTime=performance.now()-now;
            if(loadTime>2000){
                document.body.classList.add('performance-warning');
            }
        });
    };
    
    const initSecurity=()=>{
        document.querySelectorAll('a[target="_blank"]').forEach(link=>{
            if(!link.getAttribute('rel')){
                link.setAttribute('rel','noopener noreferrer');
            }
        });
        document.addEventListener('contextmenu',e=>{
            if(e.target.nodeName==='IMG')e.preventDefault();
        });
    };
    
    const initThemeDetection=()=>{
        const prefersDark=window.matchMedia('(prefers-color-scheme: dark)');
        const setTheme=(isDark)=>{
            document.documentElement.setAttribute('data-theme',isDark?'dark':'light');
        };
        setTheme(prefersDark.matches);
        prefersDark.addEventListener('change',e=>setTheme(e.matches));
    };
    
    const initFocusManagement=()=>{
        document.addEventListener('keydown',e=>{
            if(e.key==='Tab'){
                document.body.classList.add('user-tabbing');
            }
        });
        document.addEventListener('mousedown',()=>{
            document.body.classList.remove('user-tabbing');
        });
    };
    
    const initLazyLoading=()=>{
        if('loading' in HTMLImageElement.prototype){
            const images=document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img=>{
                if(img.complete)return;
                img.addEventListener('load',()=>{
                    img.classList.add('loaded');
                });
            });
        }
    };
    
    const initTouchEvents=()=>{
        let touchStartY=0;
        document.addEventListener('touchstart',e=>{
            touchStartY=e.touches[0].clientY;
        },{passive:true});
        document.addEventListener('touchmove',e=>{
            const touchY=e.touches[0].clientY;
            const diff=touchStartY-touchY;
            if(diff>0&&window.scrollY===0){
                e.preventDefault();
            }
        },{passive:false});
    };
    
    menuToggle.addEventListener('click',toggleMenu);
    document.querySelectorAll('.nav-links a').forEach(link=>{
        link.addEventListener('click',closeMenu);
    });
    
    initSmoothScroll();
    initIntersectionObserver();
    initScrollHeader();
    initPerformance();
    initSecurity();
    initThemeDetection();
    initFocusManagement();
    initLazyLoading();
    initTouchEvents();
    
    if(!document.querySelector('#dynamic-styles')){
        const style=document.createElement('style');
        style.id='dynamic-styles';
        style.textContent=`
            .user-tabbing *:focus{outline:3px solid var(--primary) !important;outline-offset:2px}
            img.loaded{animation:fadeIn 0.5s ease}
            .performance-warning .profile-card{animation:none;opacity:1;transform:none}
            @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        `;
        document.head.appendChild(style);
    }
    
    console.log('KOOPODCAST plataforma cargada y optimizada');
});