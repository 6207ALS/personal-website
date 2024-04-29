import { gsap, ScrollTrigger } from "gsap/all";
import LocomotiveScroll from 'locomotive-scroll';

import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

// --- SETUP START ---
const locoScroll = new LocomotiveScroll({
  el: document.querySelector("[data-scroll-container]"),
  smooth: true
});
// each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
locoScroll.on("scroll", ScrollTrigger.update);

// tell ScrollTrigger to use these proxy methods for the ".smooth-scroll" element since Locomotive Scroll is hijacking things
ScrollTrigger.scrollerProxy("[data-scroll-container]", {
  scrollTop(value) {
    return arguments.length ? locoScroll.scrollTo(value, {duration: 0, disableLerp: true}) : locoScroll.scroll.instance.scroll.y;
  }, // we don't have to define a scrollLeft because we're only scrolling vertically.
  getBoundingClientRect() {
    return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
  },
  // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
  pinType: document.querySelector("[data-scroll-container]").style.transform ? "transform" : "fixed"
});

// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
ScrollTrigger.defaults({ scroller: "[data-scroll-container]" });
// --- SETUP END ---


function staggerHeaderWords() {
	const header1 = new SplitType("#header-1", { types: "words" });
	gsap.set("#header-1" , { autoAlpha: 1 });
	gsap.set(header1.words, { yPercent: 100 });

	const header2 = new SplitType("#header-2", { types: "words" });
	gsap.set("#header-2", { autoAlpha: 1 });
	gsap.set(header2.words, { yPercent: 100 });

	gsap.set("#stack-container", { autoAlpha: 1 });

	gsap.to(header1.words, {
		yPercent: 0,
		duration: 0.5,
		delay: 0.5,
		ease: "ease-out",
		stagger: { from: "left", amount: 0.3, ease: "expo.out" }
	});

	gsap.to(header2.words, {
		yPercent: 0,
		duration: 0.5,
		delay: 0.7,
		ease: "ease-out",
		stagger: { from: "left", amount: 0.3, ease: "expo.out" }
	});
}

function panStack() {
	gsap.set("#stack-container", { autoAlpha: 1 });

	gsap.from("#stack-container", {
		opacity: 0,
		delay: 2.3,
		duration: 0.3,
	})

	gsap.to(["#stack-2", "#stack-3"], {
		yPercent: 12,
		delay: 2.6,
		duration: 0.5,
	});
	
	gsap.to("#stack-3", {
		yPercent: 22,
		delay: 3.1,
		duration: 0.5,
	});
}

function fadeInProfile() {
	let profile = new SplitType("#profile", { types: "lines" });

	const fadeIn = () => {
		gsap.set("#profile" , { autoAlpha: 1 });
		gsap.set(profile.lines, { yPercent: 100, opacity: 0 });

		gsap.to(profile.lines, {
			opacity: 1,
			yPercent: 0,
			duration: 0.6,
			delay: 1.4,
			ease: "ease-out",
			stagger: { from: "left", amount: 0.3, ease: "linear" }
		});
	}
	
	fadeIn();
	window?.addEventListener("resize", (event) => {
		profile = new SplitType("#profile", { types: "lines" });
	});
}

function animatePrimaryMarquee() {
	const marquee = document.querySelector("#primary-marquee-wrapper");
	const marqueeContent = marquee.firstElementChild;

	const width = parseInt(
		getComputedStyle(marqueeContent).getPropertyValue("width"), 10
	);
	const gap = parseInt(
		(getComputedStyle(marqueeContent).getPropertyValue("column-gap")), 10
	) || 0;

	const distanceToTranslate = -1 * (width + gap);

	gsap.fromTo(
		marquee.children,
		{x: 0},
		{
			x: distanceToTranslate,
			duration: 17,
			ease: "linear",
			repeat: -1,
		}
	);
	window.addEventListener("resize", debounce(animatePrimaryMarquee));
}

function animateTertiaryMarquee() {
	const marquee = document.querySelector("#tertiary-container");
	const marqueeContent = marquee.firstElementChild;

	const width = parseInt(
		getComputedStyle(marqueeContent).getPropertyValue("width"), 10
	);
	const gap = parseInt(
		(getComputedStyle(marqueeContent).getPropertyValue("column-gap")), 10
	) || 0;

	const distanceToTranslate = -1 * ((width + gap) * 2);

	gsap.fromTo(
		marquee.children,
		{x: distanceToTranslate},
		{
			x: 0,
			duration: 40,
			ease: "linear",
			repeat: -1,
		}
	);
	window.addEventListener("resize", debounce(animateTertiaryMarquee));
}

function changeFontRandomly(letter) {
	const randomTime = (Math.random() * (3 - 2) + 2);
	const random = Math.floor(Math.random() * 2)
	// const letterDisplay = getComputedStyle(letter.children[1]).getPropertyValue("display");
	// const isRansomFont = letterDisplay === "block";

	const changeToRansomFont = (letter) => {
		letter.firstElementChild.style.display = "none";
		letter.children[1].style.display = "block";
	}

	const changeToRegularFont = (letter) => {
		letter.firstElementChild.style.display = "flex";
		letter.children[1].style.display = "none";
	}

	random ? 
	changeToRegularFont(letter)
	: changeToRansomFont(letter);
	
	setTimeout(() => changeFontRandomly(letter), randomTime * 1000);
}

function animateRansomLetters() {
	const letters = document.querySelectorAll(".letter-container");

	letters.forEach(letter => changeFontRandomly(letter));
}

function animateContactText() {
	const opportunityText = document.querySelector("#opportunity-text");
	const contactText = document.querySelector("#contact-text-container");

	gsap.set(opportunityText, {
		opacity: 0,
	});

	gsap.set(contactText, {
		opacity: 0,
	});
	
	gsap.to(opportunityText, {
		scrollTrigger: {
			trigger: "#opportunity-text-wrapper",
		},
		opacity: 1,
		duration: 0.5,
		delay: 0.5,
		ease: "ease-out",
	});

	gsap.to(contactText, {
		scrollTrigger: {
			trigger: "#contact-text-wrapper",
		},
		opacity: 1,
		duration: 1,
		delay: 0.7,
		ease: "ease-out",
	});
}

function debounce(func) {
	var timer;

	return function(event) {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => { func() }, 500, event);
	}
}

async function onDOMContentLoaded() {
	await document.fonts.ready;
	staggerHeaderWords();
	panStack();
	fadeInProfile();
	animatePrimaryMarquee();
	animateTertiaryMarquee();
	animateRansomLetters();
	animateContactText();
}

document.addEventListener("DOMContentLoaded", onDOMContentLoaded)

// gsap.fromTo(".transition", {
// 	x: "-100vw",
// }, {
// 	x: 0,
// 	duration: 2,
// 	scrollTrigger: {
// 	  trigger: ".page2",
// 	  start: "top 100%",
// 	  end: "bottom 0%",
// 	  toggleActions: "play reset play reset"
 // 	}
// });



//responsive
// let mm = gsap.matchMedia();

// mm.add("(min-width: 800px)", () => {
//   gsap.to(".box", {
//     duration: .6,
//     width: "80%",
//     ease: "power2",
//     scrollTrigger: {
//       trigger: ".box",
//       start: "top 90%",
//       end: "bottom 20%",
//     }
//   });
// });