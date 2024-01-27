import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './style.css';

// Const API
const API_URL = 'https://jsonplaceholder.typicode.com/albums';

const AlbumList = () => {
  const [albums, setAlbums] = useState([]);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [updatedAlbumTitle, setUpdatedAlbumTitle] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateAlbumId, setUpdateAlbumId] = useState(null);

  // Fetch albums data on componenet mount (only first time)
  useEffect(() => {
    fetchAlbums();
  }, []);

  // Helper routine for GET API call using axios
  const fetchAlbums = async () => {
    try {
      const response = await axios.get(API_URL);
      setAlbums(response.data);
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };

  // Helper routine for POST API call to Add new album
  const addAlbum = async () => {
    try {
      const response = await axios.post(API_URL, { title: newAlbumTitle });
      setAlbums([...albums, response.data]);
      setNewAlbumTitle('');
    } catch (error) {
      console.error('Error adding album:', error);
    }
  };

  // Helper routine for UPDATE API call to Update the alubm
  const updateAlbum = async () => {
    if (!updateAlbumId) {
      return; // Do nothing if updateAlbumId is not set
    }
    try {
      await axios.put(`${API_URL}/${updateAlbumId}`, { title: updatedAlbumTitle });
      const updatedAlbums = albums.map(album =>
        album.id === updateAlbumId ? { ...album, title: updatedAlbumTitle } : album
      );
      setAlbums(updatedAlbums);
      setUpdateAlbumId(null);
      setNewAlbumTitle('');
      setShowUpdateModal(false);
    } catch (error) {
      console.error('Error updating album:', error);
    }
  };

  // Helper routine for DELETE API call
  const deleteAlbum = async id => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      const updatedAlbums = albums.filter(album => album.id !== id);
      setAlbums(updatedAlbums);
    } catch (error) {
      console.error('Error deleting album:', error);
    }
  };

  return (
    <div className="app-container">
      <div className="add-album">
        <input
          type="text"
          placeholder="New Album Title"
          value={newAlbumTitle}
          onChange={e => setNewAlbumTitle(e.target.value)}
        />
        <button onClick={addAlbum}>Add Album</button>
      </div>
      <h1 className="app-title">Albums List</h1>
      <div className="row">
      {albums.map(album => (
        <div key={album.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{album.title}</h5>
              <div className="card-button">
                <button className="btn btn-primary mr-2"
                  onClick={() => {setUpdateAlbumId(album.id)
                    setShowUpdateModal(true);
                    setUpdatedAlbumTitle(album.title)}}>
                  Update
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteAlbum(album.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
        ))}
      </div>

      {showUpdateModal && (
        <div className="modal" tabindex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enter new title:</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"
                  onClick={() => setShowUpdateModal(false)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
              <input
                type="text"
                value={updatedAlbumTitle}
                onChange={e => setUpdatedAlbumTitle(e.target.value)}
              />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary"
                  onClick={updateAlbum}>
                    Save changes
                </button>
                <button type="button" className="btn btn-secondary" data-dismiss="modal"
                  onClick={() => setShowUpdateModal(false)}>
                    Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlbumList;