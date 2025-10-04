export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="card text-center">
          <h2 className="text-3xl font-bold text-zus-darkblue mb-4">
            Witaj w Symulatorze Emerytalnym ZUS
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Sprawdź, jaka będzie Twoja przyszła emerytura i zaplanuj swoją przyszłość finansową.
          </p>
          <div className="flex justify-center gap-4">
            <button className="btn-primary">
              Rozpocznij Symulację
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

