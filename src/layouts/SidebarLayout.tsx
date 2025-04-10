/// <reference types="vite-plugin-svgr/client" />
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import React, { useMemo } from 'react';
import BlendIcon from './../assets/images/blend-icon.svg?react';
import { classNames } from '../helpers';
import { useBlends } from '../api/blends/useBlends';
import CreateBlendModal from '../components/CreateBlendModal';

interface NavigationLink {
  name: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  to: string;
}

export default function SidebarLayout() {
  const { pathname } = useLocation();
  const { blends } = useBlends('');

  const navigation: NavigationLink[] = [
    {
      name: 'Spices',
      icon: BlendIcon,
      to: '/spices',
    },
    {
      name: 'Blends',
      icon: BlendIcon,
      to: '/blends',
    },
  ];

  const userBlends = useMemo(
    () => blends.filter((blend) => !blend.locked),
    [blends],
  );

  return (
    <>
      <div className="h-full min-h-screen">
      <CreateBlendModal />
        {/* Sidebar */}
        <div className="w-72 inset-y-0 fixed flex flex-col border-r border-teal-100">
          <div className="flex grow bg-cream p-4 flex-col">
            <div className="text-4xl h-16 w-full flex items-center mb-4 pl-2">
              <span className="text-coral-500">spice</span>
              <span className="text-coral-500 font-bold">BLEND</span>
            </div>
            <div className="mt-6">
              <ul className="space-y-4">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.to}
                      className={classNames(
                        pathname === item.to
                          ? 'bg-gray-950/5 text-teal-400'
                          : 'hover:bg-gray-950/10 text-gray-850',
                        'flex item-center gap-x-2 text-sm p-2 rounded-md',
                      )}
                    >
                      <item.icon className="w-6" />
                      <span className="mt-1 font-medium">{item.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-20">
              <div className="text-xs text-gray-700 font-bold mb-2">
                Your Blends
              </div>
              <ul className="space-y-2">
                {userBlends.map((blend) => (
                  <li key={blend.name}>
                    <NavLink
                      to={`/blends/${blend.id}`}
                      className={classNames(
                        pathname === `/blends/${blend.id}`
                          ? 'bg-gray-950/5 '
                          : 'hover:bg-gray-950/10 hover:text-gray-850',
                        'flex item-center gap-x-2 text-sm p-2 rounded-md text-gray-700',
                      )}
                    >
                      <BlendIcon className="w-4" />
                      <span className="mt-1 font-medium">{blend.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Main Body*/}
        <main className="pl-72 bg-gray-75 h-screen overflow-auto">
          <Outlet />
        </main>
      </div>
    </>
  );
}
