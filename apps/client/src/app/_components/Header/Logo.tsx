import Image from "next/image";

export default function Logo() {
  return (
    <div className="relative h-6 w-17">
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
