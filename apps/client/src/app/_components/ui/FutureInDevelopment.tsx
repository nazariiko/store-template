import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyLarge,
  TypographyP,
} from "@/components/ui/typography";

function FutureInDevelopment() {
  return (
    <div className="flex h-[250px] flex-col items-center justify-center text-center">
      <TypographyH3>Функціонал на стадії розробки 👨‍💻</TypographyH3>
      <TypographyP>
        Зверніться до розробника, щоб дізнатись деталі :)
      </TypographyP>
    </div>
  );
}

export default FutureInDevelopment;
