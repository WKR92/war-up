import React from 'react'
import { createPortal } from 'react-dom';

interface IProps {
  wrapperId: string;
  children: React.ReactNode;
}

const YesNoMOdal: React.FC<IProps> = ({ children, wrapperId }) => {
  return createPortal(children, document.getElementById(wrapperId) as HTMLElement);
}

export default YesNoMOdal;