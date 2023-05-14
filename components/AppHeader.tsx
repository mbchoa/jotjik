import Link from 'next/link';

const AppHeader: React.FC = () => (
  <header className="flex bg-pink-900 px-4 text-white">
    <div className="flex flex-1 items-center max-w-6xl m-auto">
      <span className="inline-block text-2xl">
        <Link href="/">
          <span role="img" aria-label="Clock emoji">
            ⏳
          </span>{' '}
          jotjik
        </Link>
      </span>
      <nav className="ml-auto">
        <ul>
          <li>
            <Link href="/stats" className="text-xl">
              <span role="img" aria-label="Chart with upwards trend emoji">
                📈
              </span>
            </Link>
          </li>
          <li></li>
        </ul>
      </nav>
    </div>
  </header>
);

export default AppHeader;
