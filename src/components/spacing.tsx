interface SpacingProps {
  className?: string;
}

const Spacing = ({ className = '' }: SpacingProps) => {
  return <div className={`w-full ${className}`} />;
};

export default Spacing;