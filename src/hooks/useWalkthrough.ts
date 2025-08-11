"use client";

import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const useDeckWalkthrough = () => {
  useEffect(() => {
    const hasSeenDeckWalkthrough = localStorage.getItem("hasSeenDeckWalkthrough");
    
    if (!hasSeenDeckWalkthrough) {
      const driverObj = driver({
        showProgress: true,
        steps: [
          {
            element: "[data-tour='deck-hero']",
            popover: {
              title: "Your Deck Overview",
              description: "Here you can see your deck's details, including the language, total islands, and flashcards.",
              side: "bottom",
              align: "start"
            }
          },
          {
            element: "[data-tour='study-button']",
            popover: {
              title: "Study Your Cards",
              description: "Click here to start studying your flashcards using spaced repetition.",
              side: "bottom",
              align: "start"
            }
          },
          {
            element: "[data-tour='create-island-button']",
            popover: {
              title: "Create New Islands",
              description: "Add new themed islands to organize your flashcards by topics or scenarios.",
              side: "bottom",
              align: "start"
            }
          },
          {
            element: "[data-tour='category-tabs']",
            popover: {
              title: "Browse Your Islands",
              description: "Navigate between different islands to view and manage your flashcards.",
              side: "top",
              align: "start"
            }
          },
          {
            element: "[data-tour='flashcard-list']",
            popover: {
              title: "Your Flashcards",
              description: "View all flashcards in the selected island. You can edit or delete individual cards.",
              side: "top",
              align: "start"
            }
          }
        ],
        onDestroyStarted: () => {
          localStorage.setItem("hasSeenDeckWalkthrough", "true");
          driverObj.destroy();
        }
      });

      setTimeout(() => {
        driverObj.drive();
      }, 500);
    }
  }, []);
};

export const useStudyWalkthrough = () => {
  useEffect(() => {
    const hasSeenStudyWalkthrough = localStorage.getItem("hasSeenStudyWalkthrough");
    
    if (!hasSeenStudyWalkthrough) {
      const driverObj = driver({
        showProgress: true,
        steps: [
          {
            element: "[data-tour='study-card']",
            popover: {
              title: "Flashcard Study Mode",
              description: "This is your flashcard. Click to flip it and see the answer.",
              side: "bottom",
              align: "center"
            }
          },
          {
            element: "[data-tour='difficulty-buttons']",
            popover: {
              title: "Rate Your Knowledge",
              description: "After revealing the answer, rate how well you knew it. This helps the spaced repetition algorithm optimize your learning.",
              side: "top",
              align: "center"
            }
          },
          {
            element: "[data-tour='progress-bar']",
            popover: {
              title: "Study Progress",
              description: "Track your progress through the current study session.",
              side: "bottom",
              align: "center"
            }
          },
          {
            element: "[data-tour='study-stats']",
            popover: {
              title: "Session Statistics",
              description: "View your performance metrics for this study session.",
              side: "left",
              align: "center"
            }
          },
          {
            element: "[data-tour='exit-study']",
            popover: {
              title: "Exit Study Mode",
              description: "Click here to return to your deck when you're done studying.",
              side: "bottom",
              align: "center"
            }
          }
        ],
        onDestroyStarted: () => {
          localStorage.setItem("hasSeenStudyWalkthrough", "true");
          driverObj.destroy();
        }
      });

      setTimeout(() => {
        driverObj.drive();
      }, 500);
    }
  }, []);
};