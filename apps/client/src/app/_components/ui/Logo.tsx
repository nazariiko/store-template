import Image from "next/image";

export default function Logo({ className }: { className: string }) {
  const containerClassName = `relative ${className}`;
  return (
    <div className={containerClassName}>
      <Image
        className="block dark:hidden"
        src="/logo.svg"
        alt="Store logotype"
        fill={true}
        priority
      />
      <Image
        className="hidden dark:block"
        src="/logo-dark.svg"
        alt="Store logotype"
        fill={true}
        priority
      />
    </div>
  );
}
