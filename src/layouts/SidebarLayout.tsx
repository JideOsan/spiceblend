/// <reference types="vite-plugin-svgr/client" />
import { NavLink, Outlet } from 'react-router-dom';
import React from 'react';
import BlendIcon from './../assets/images/blend-icon.svg?react';

interface NavigationLink {
  name: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  to: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function SidebarLayout() {
  const current = '/spices';
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

  const userBlends: NavigationLink[] = [
    {
      name: 'Taco Seasoning',
      icon: BlendIcon,
      to: '',
    },
    {
      name: 'Steak Seasoning',
      icon: BlendIcon,
      to: '',
    },
  ];

  return (
    <>
      <div className="h-full min-h-screen">
        {/* Sidebar */}
        <div className="w-72 inset-y-0 fixed flex flex-col border-r border-teal-200">
          <div className="flex grow bg-cream p-4 flex-col">
            <div className="text-4xl h-16 w-full flex items-center mb-4 pl-2">
              <span className="text-coral-500">spice</span>
              <span className="text-coral-500 font-bold">BLEND</span>
            </div>
            <div>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.to}
                      className={classNames(
                        current === item.to ? 'bg-gray-950/5 text-primary' : '',
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
            <div>
              <div>Your Blends</div>
              <ul className="space-y-2">
                {userBlends.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.to}
                      className={classNames(
                        current === item.to ? 'bg-gray-950/5 text-primary' : '',
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
          </div>
        </div>

        {/* Main Body*/}
        <main className="pl-72 bg-gray-75">
          <Outlet />
        </main>
      </div>
    </>
  );
}
