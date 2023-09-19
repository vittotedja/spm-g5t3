import { useParams } from 'react-router-dom';

const RoleDetails: React.FC = () => {
  const { role_ID } = useParams<{ role_ID: string }>();
  return (
    <div>
      <h1>{role_ID} Detail page</h1>
    </div>
  );
};

export default RoleDetails;
