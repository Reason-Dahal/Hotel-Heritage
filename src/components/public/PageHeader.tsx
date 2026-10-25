interface Props {
  title: string;
  intro?: string;
}

export default function PageHeader({ title, intro }: Props) {
  return (
    <div /*className="border-b border-brand-100 bg-brand-50"*/>
      <div className="mx-auto max-w-6xl px-4 py-5 text-center md:py-10">
        <h1 className="text-2xl font-bold text-gray-900 md:text-4xl">{title}</h1>
        {intro && (
          <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-600 md:mt-3 md:text-base">
            {intro}
          </p>
        )}
      </div>
    </div>
  );
}