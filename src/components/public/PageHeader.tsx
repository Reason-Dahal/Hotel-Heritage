interface Props {
    title: string;
    intro?: string;
  }
  
  export default function PageHeader({ title, intro }: Props) {
    return (
      <div className="border-b border-brand-100 bg-brand-50">
        <div className="mx-auto max-w-6xl px-4 py-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">{title}</h1>
          {intro && <p className="mx-auto mt-3 max-w-2xl text-gray-600">{intro}</p>}
        </div>
      </div>
    );
  }