import { Loader2 } from 'lucide-react';

// ============================================================
// LoadingSpinner - Indicador de carga
// ============================================================

const LoadingSpinner = ({ size = 'md', text = 'Cargando...' }) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className={`${sizes[size]} animate-spin text-primary`} />
      {text && <p className="mt-3 text-gray-500 text-sm">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
