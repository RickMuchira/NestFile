import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaFolderOpen } from 'react-icons/fa';
import Button from './common/Button';
import Container from './common/Container';

const Breadcrumb = ({ directoryStructure }) => {
  const navigate = useNavigate();
  const { directoryId } = useParams();

  if (!directoryStructure || directoryStructure.length === 0) {
    return null;
  }

  return (
    <Container className="breadcrumb mb-6 p-4 bg-white rounded-lg shadow-lg flex items-center">
      {directoryStructure.map((directory, index) => (
        <React.Fragment key={directory.id}>
          <span className="breadcrumb-item text-lg flex items-center">
            <FaFolderOpen className="mr-2 text-yellow-500" aria-label="folder icon" />
            {index < directoryStructure.length - 1 ? (
              <Link
                to={`/directory/${directory.id}`}
                className="text-blue-600 hover:underline"
                aria-label={`Navigate to ${directory.name}`}
              >
                {directory.name}
              </Link>
            ) : (
              <span className="text-gray-800 font-semibold" aria-current="location">
                {directory.name}
              </span>
            )}
          </span>
          {index < directoryStructure.length - 1 && (
            <span className="mx-3 text-gray-500">/</span>
          )}
        </React.Fragment>
      ))}
      <Button
        onClick={() => navigate(-1)}
        className="ml-auto bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Back
      </Button>
    </Container>
  );
};

export default Breadcrumb;
