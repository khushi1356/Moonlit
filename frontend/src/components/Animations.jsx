import { motion } from 'framer-motion';

export const FadeUp = ({ children, delay = 0, className = "", direction = "up", distance = 60 }) => {
  const yOffset = direction === "up" ? distance : direction === "down" ? -distance : 0;
  const xOffset = direction === "left" ? distance : direction === "right" ? -distance : 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset, x: xOffset }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const RevealText = ({ text, className = "", delay = 0, as = "div", style = {} }) => {
  const words = typeof text === 'string' ? text.split(" ") : [];
  const Tag = motion[as] || motion.div;
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: delay },
    },
  };
  
  const child = {
    visible: { opacity: 1, y: 0, rotate: 0, transition: { type: "spring", damping: 16, stiffness: 100 } },
    hidden: { opacity: 0, y: 50, rotate: 5 },
  };

  return (
    <Tag
      style={{ overflow: "hidden", display: "flex", flexWrap: "wrap", ...style }}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      className={className}
    >
      {words.map((word, index) => (
        <motion.span variants={child} style={{ marginRight: "0.25em", display: "inline-block", paddingBottom: "5px" }} key={index}>
          {word}
        </motion.span>
      ))}
    </Tag>
  );
};
