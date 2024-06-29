import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {
  SettingsPanel,
  SettingsToggle,
  useAppContext,
  useSettingsPanelContext,
  useToggleStyle
} from "@frs535/react-ui-components";

function App() {
  const { isStylesheetLoaded } = useToggleStyle();
  const { pathname } = useLocation();

  const {
    settingsPanelConfig: { showSettingPanelButton },
    setSettingsPanelConfig
  } = useSettingsPanelContext();

  const {
    config: { theme, isRTL }
  } = useAppContext();

  // Automatically scrolls to top whenever pathname changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setSettingsPanelConfig({
      openSettingPanel: false
    });
  }, [isRTL]);

  return (
      <>
        {!isStylesheetLoaded ? (
            <div
                style={{
                  position: 'fixed',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
                  backgroundColor: theme === 'dark' ? '#000' : '#fff'
                }}
            />
        ) : (
            <>
              <Outlet />
              {showSettingPanelButton && (
                  <>
                    <SettingsToggle />
                    <SettingsPanel />
                  </>
              )}
            </>
        )}
      </>
  );
}

export default App
