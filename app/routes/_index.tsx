import { RekaProvider } from '@rekajs/react';

import { Header } from '~/components/header';
import { SideMenu } from '~/components/side-menu';
import { Canvas } from '~/components/canvas';
import { ReactIframe } from '~/components/react-iframe';
import { ControlPanel } from '~/components/control-panel';
import { Viewport } from '~/components/viewport';
import { reka } from '~/lib/reka';
import { BuilderProvider } from '~/components/builder-provider';
import { RekaRenderer } from '~/components/reka-renderer';

export default function Index() {
  return (
    <RekaProvider reka={reka}>
      <BuilderProvider>
        <section className="flex min-h-screen w-full flex-col">
          <Header />
          <div className="relative flex flex-1 overflow-hidden">
            <SideMenu />
            <Viewport>
              <Canvas>
                <ReactIframe
                  title="reka-preview"
                  className="page-container h-full w-full p-4"
                >
                  <div className="min-h-full bg-white p-6">
                    <RekaRenderer />
                  </div>
                </ReactIframe>
              </Canvas>
            </Viewport>
            <ControlPanel />
          </div>
        </section>
      </BuilderProvider>
    </RekaProvider>
  );
}
