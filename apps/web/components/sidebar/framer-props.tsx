export const sidebarVariants = {
    open: {
        width: "15rem",
    },
    closed: {
        width: "3.05rem",
    },
};

export const contentVariants = {
    open: { display: "block", opacity: 1 },
    closed: { display: "block", opacity: 1 },
};

export const variants = {
    open: {
        x: 0,
        opacity: 1,
        transition: {
            x: { stiffness: 1000, velocity: -100 },
        },
    },
    closed: {
        x: -20,
        opacity: 0,
        transition: {
            x: { stiffness: 100 },
        },
    },
};

export const transitionProps = {
    type: "tween",
    ease: "easeOut",
    duration: 0.2,
    staggerChildren: 0.1,
};

export const staggerVariants = {
    open: {
        transition: { staggerChildren: 0.03, delayChildren: 0.02 },
    },
};