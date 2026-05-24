import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`rounded-xl bg-slate-50 dark:bg-slate-800 p-5 shadow-sm dark:shadow-none ${className}`}>
      {children}
    </div>
  );
};

export default Card;
