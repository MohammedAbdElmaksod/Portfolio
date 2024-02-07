var menuLinks = document.querySelector(".menu-links");
var menuBtn = document.querySelector(".navbar .menu i");
var aboutSection = document.querySelector(".about");

// show and hide menu links
menuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  menuLinks.classList.toggle("active");
});
document.addEventListener("click", () => {
  if (menuLinks.classList.contains("active")) {
    menuLinks.classList.remove("active");
  }
});


// skills animation

window.onscroll = function(){
    // about offset top
    let aboutOffsetTop = aboutSection.offsetTop;
    // about outer height
    let aboutOuterHeight = aboutSection.offsetHeight;
    // window height
    let windowheight = this.innerHeight;
    // window scroll from top
    let windowScrollTop = this.pageYOffset;

    if(windowScrollTop > (aboutOffsetTop + aboutOuterHeight - windowheight - 300)){
        let allSkills =document.querySelectorAll(".about .about-info .skills .skill .progress span");
        allSkills.forEach(skill=>{
            skill.style.width= skill.dataset.width;
        })
    }
}