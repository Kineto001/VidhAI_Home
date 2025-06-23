document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation Drawer Logic (unchanged) ---
    const menuButton = document.getElementById('menu-button');
    const navDrawer = document.getElementById('nav-drawer');
    const pageContent = document.getElementById('page-content');
    const navLinks = document.querySelectorAll('.nav-link');

    const toggleNav = () => {
        navDrawer.classList.toggle('open');
        document.body.classList.toggle('nav-open');
    };

    menuButton.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleNav();
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navDrawer.classList.contains('open')) toggleNav();
        });
    });

    pageContent.addEventListener('click', () => {
        if (navDrawer.classList.contains('open')) toggleNav();
    });

    // --- NEW: Advanced Touch and Drag Slider Logic ---
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');

    let isDragging = false,
        startPos = 0,
        currentTranslate = 0,
        prevTranslate = 0,
        animationID,
        currentIndex = 0;

    const totalSlides = slides.length;

    // Add event listeners for touch and mouse
    slides.forEach((slide, index) => {
        // Disable default image drag behavior
        slide.querySelector('img').addEventListener('dragstart', (e) => e.preventDefault());

        // Touch events
        slide.addEventListener('touchstart', touchStart(index));
        slide.addEventListener('touchend', touchEnd);
        slide.addEventListener('touchmove', touchMove);

        // Mouse events
        slide.addEventListener('mousedown', touchStart(index));
        slide.addEventListener('mouseup', touchEnd);
        slide.addEventListener('mouseleave', touchEnd);
        slide.addEventListener('mousemove', touchMove);
    });

    // Make arrows work
    prevButton.addEventListener('click', showPrevSlide);
    nextButton.addEventListener('click', showNextSlide);

    function touchStart(index) {
        return function(event) {
            currentIndex = index;
            startPos = getPositionX(event);
            isDragging = true;
            slider.style.transition = 'none'; // Remove transition during drag
            animationID = requestAnimationFrame(animation);
            slider.classList.add('grabbing');
        }
    }

    function touchEnd() {
        if (!isDragging) return;
        isDragging = false;
        cancelAnimationFrame(animationID);

        const movedBy = currentTranslate - prevTranslate;

        // Snap to next/prev slide if moved more than a threshold
        if (movedBy < -100 && currentIndex < totalSlides - 1) {
            currentIndex += 1;
        }

        if (movedBy > 100 && currentIndex > 0) {
            currentIndex -= 1;
        }

        setPositionByIndex();

        slider.classList.remove('grabbing');
    }

    function touchMove(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            currentTranslate = prevTranslate + currentPosition - startPos;
        }
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function animation() {
        setSliderPosition();
        if (isDragging) requestAnimationFrame(animation);
    }

    function setSliderPosition() {
        slider.style.transform = `translateX(${currentTranslate}px)`;
    }

    function setPositionByIndex() {
        // Get the width of a single slide
        const slideWidth = slides[0].clientWidth;
        currentTranslate = currentIndex * -slideWidth;
        prevTranslate = currentTranslate;
        slider.style.transition = 'transform 0.4s ease-out'; // Add back transition
        setSliderPosition();
        updateArrowState();
    }
    
    function showPrevSlide() {
        if (currentIndex > 0) {
            currentIndex -= 1;
            setPositionByIndex();
        }
    }
    
    function showNextSlide() {
        if (currentIndex < totalSlides - 1) {
            currentIndex += 1;
            setPositionByIndex();
        }
    }

    function updateArrowState() {
        prevButton.style.display = (currentIndex === 0) ? 'none' : 'flex';
        nextButton.style.display = (currentIndex === totalSlides - 1) ? 'none' : 'flex';
    }

    // Initial setup
    updateArrowState();
});