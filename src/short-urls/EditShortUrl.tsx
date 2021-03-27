import { FC, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import { SelectedServer } from '../servers/data';
import { Settings, ShortUrlCreationSettings } from '../settings/reducers/settings';
import { OptionalString } from '../utils/utils';
import { parseQuery } from '../utils/helpers/query';
import Message from '../utils/Message';
import { Result } from '../utils/Result';
import { ShlinkApiError } from '../api/ShlinkApiError';
import { ShortUrlFormProps } from './ShortUrlForm';
import { ShortUrlDetail } from './reducers/shortUrlDetail';
import { EditShortUrlData, ShortUrl, ShortUrlData } from './data';
import { ShortUrlEdition } from './reducers/shortUrlEdition';

interface EditShortUrlConnectProps extends RouteComponentProps<{ shortCode: string }> {
  settings: Settings;
  selectedServer: SelectedServer;
  shortUrlDetail: ShortUrlDetail;
  shortUrlEdition: ShortUrlEdition;
  getShortUrlDetail: (shortCode: string, domain: OptionalString) => void;
  editShortUrl: (shortUrl: string, domain: OptionalString, data: EditShortUrlData) => Promise<void>;
}

const getInitialState = (shortUrl?: ShortUrl, settings?: ShortUrlCreationSettings): ShortUrlData => {
  const validateUrl = settings?.validateUrls ?? false;

  if (!shortUrl) {
    return { longUrl: '', validateUrl };
  }

  return {
    longUrl: shortUrl.longUrl,
    tags: shortUrl.tags,
    title: shortUrl.title ?? undefined,
    domain: shortUrl.domain ?? undefined,
    validSince: shortUrl.meta.validSince ?? undefined,
    validUntil: shortUrl.meta.validUntil ?? undefined,
    maxVisits: shortUrl.meta.maxVisits ?? undefined,
    validateUrl,
  };
};

export const EditShortUrl = (ShortUrlForm: FC<ShortUrlFormProps>) => ({
  match: { params },
  location: { search },
  settings: { shortUrlCreation: shortUrlCreationSettings },
  selectedServer,
  shortUrlDetail,
  getShortUrlDetail,
  shortUrlEdition,
  editShortUrl,
}: EditShortUrlConnectProps) => {
  const { loading, error, errorData, shortUrl } = shortUrlDetail;
  const { saving, error: savingError, errorData: savingErrorData } = shortUrlEdition;
  const { domain } = parseQuery<{ domain?: string }>(search);

  useEffect(() => {
    getShortUrlDetail(params.shortCode, domain);
  }, []);

  if (loading) {
    return <Message loading />;
  }

  if (error) {
    return (
      <Result type="error">
        <ShlinkApiError errorData={errorData} fallbackMessage="An error occurred while loading short URL detail :(" />
      </Result>
    );
  }

  return (
    <>
      <ShortUrlForm
        initialState={getInitialState(shortUrl, shortUrlCreationSettings)}
        saving={saving}
        selectedServer={selectedServer}
        mode="edit"
        onSave={async (shortUrlData) => shortUrl && editShortUrl(shortUrl.shortCode, shortUrl.domain, shortUrlData)}
      />
      {savingError && (
        <Result type="error" className="mt-3">
          <ShlinkApiError errorData={savingErrorData} fallbackMessage="An error occurred while updating short URL :(" />
        </Result>
      )}
    </>
  );
};
