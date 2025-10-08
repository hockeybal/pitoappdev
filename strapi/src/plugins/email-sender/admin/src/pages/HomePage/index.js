import React, { useState, useEffect } from 'react';
import {
  Page,
  Layout,
  HeaderLayout,
  ContentLayout,
  Button,
  Select,
  MultiSelect,
  Textarea,
  Alert,
} from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { useFetchClient } from '@strapi/helper-plugin';

const HomePage = () => {
  const { formatMessage } = useIntl();
  const { get, post } = useFetchClient();
  const [templates, setTemplates] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [variables, setVariables] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    // Fetch templates
    get('/email-templates')
      .then(({ data }) => setTemplates(data.data || []))
      .catch(err => console.error('Fetch templates error:', err));

    // Fetch users
    get('/users')
      .then(({ data }) => setUsers(data || []))
      .catch(err => console.error('Fetch users error:', err));
  }, [get]);

  const handleSend = async () => {
    if (!selectedTemplate || selectedUsers.length === 0) {
      setAlert({ type: 'danger', message: 'Select a template and at least one user.' });
      return;
    }

    setLoading(true);
    setAlert(null);

    try {
      const userIds = selectedUsers.map(u => u.id);
      const vars = variables ? JSON.parse(variables) : {};

      await post('/email-template/send', {
        templateId: selectedTemplate.id,
        userIds,
        variables: vars,
      });

      setAlert({ type: 'success', message: 'Emails sent successfully!' });
      setSelectedUsers([]);
      setVariables('');
    } catch (error) {
      setAlert({ type: 'danger', message: 'Error: ' + (error.response?.data?.error?.message || error.message) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Page.Main>
        <HeaderLayout
          title={formatMessage({
            id: 'email-sender.plugin.name',
            defaultMessage: 'Email Sender',
          })}
          subtitle={formatMessage({
            id: 'email-sender.page.subtitle',
            defaultMessage: 'Send email templates to users',
          })}
        />
        <ContentLayout>
          {alert && (
            <Alert variant={alert.type} closeLabel="Close">
              {alert.message}
            </Alert>
          )}
          <Select
            label="Select Email Template"
            value={selectedTemplate}
            onChange={setSelectedTemplate}
            options={templates.map(t => ({ value: t, label: t.attributes.subject }))}
          />
          <MultiSelect
            label="Select Users"
            value={selectedUsers}
            onChange={setSelectedUsers}
            options={users.map(u => ({ value: u, label: u.username || u.email }))}
          />
          <Textarea
            label="Variables (JSON, optional)"
            value={variables}
            onChange={e => setVariables(e.target.value)}
            placeholder='{"key": "value"}'
          />
          <Button onClick={handleSend} loading={loading}>
            Send Emails
          </Button>
        </ContentLayout>
      </Page.Main>
    </Layout>
  );
};

export default HomePage;