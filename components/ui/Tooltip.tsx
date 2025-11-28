'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/lib/redux/store';

const Tooltip = () => {
  const { tooltip } = useSelector((state: RootState) => state.ui);

  if (!tooltip.visible) return null;

  return (
    <div
      className="fixed z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg max-w-xs"
      style={{
        left: `${tooltip.position.x}px`,
        top: `${tooltip.position.y}px`,
        transform: 'translate(-50%, -100%)',
      }}
    >
      {tooltip.content}
      <div
        className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"
      />
    </div>
  );
};

export default Tooltip;