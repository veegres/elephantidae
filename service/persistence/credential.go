package persistence

import (
	"bytes"
	"encoding/gob"
	"github.com/google/uuid"
	. "ivory/model"
)

type CredentialRepository struct {
	common           common
	secretBucket     []byte
	credentialBucket []byte
	encryptedRefKey  string
	decryptedRefKey  string
}

func (r CredentialRepository) UpdateRefs(encrypted string, decrypted string) error {
	var err error
	err = r.common.update(r.secretBucket, r.encryptedRefKey, encrypted)
	err = r.common.update(r.secretBucket, r.decryptedRefKey, decrypted)
	return err
}

func (r CredentialRepository) GetEncryptedRef() string {
	get, err := r.common.get(r.secretBucket, r.encryptedRefKey)
	if err != nil {
		return ""
	}
	var str string
	buff := bytes.NewBuffer(get)
	_ = gob.NewDecoder(buff).Decode(&str)
	return str
}

func (r CredentialRepository) GetDecryptedRef() string {
	get, err := r.common.get(r.secretBucket, r.decryptedRefKey)
	if err != nil {
		return ""
	}
	var str string
	buff := bytes.NewBuffer(get)
	_ = gob.NewDecoder(buff).Decode(&str)
	return str
}

func (r CredentialRepository) Create(credential Credential) (uuid.UUID, Credential, error) {
	key := uuid.New()
	err := r.common.update(r.credentialBucket, key.String(), credential)
	cred := Credential{Username: credential.Username, Password: "configured", Type: credential.Type}
	return key, cred, err
}

func (r CredentialRepository) Update(key uuid.UUID, credential Credential) (uuid.UUID, Credential, error) {
	err := r.common.update(r.credentialBucket, key.String(), credential)
	cred := Credential{Username: credential.Username, Password: "configured", Type: credential.Type}
	return key, cred, err
}

func (r CredentialRepository) Delete(key uuid.UUID) error {
	return r.common.delete(r.credentialBucket, key.String())
}

func (r CredentialRepository) DeleteAll() error {
	return r.common.deleteAll(r.credentialBucket)
}

func (r CredentialRepository) List() map[string]Credential {
	return r.getCredentialMap(nil)
}

func (r CredentialRepository) ListByType(credentialType CredentialType) map[string]Credential {
	return r.getCredentialMap(func(credential Credential) bool {
		return credential.Type == credentialType
	})
}

func (r CredentialRepository) Get(uuid uuid.UUID) (Credential, error) {
	value, err := r.common.get(r.credentialBucket, uuid.String())
	var credential Credential
	buff := bytes.NewBuffer(value)
	err = gob.NewDecoder(buff).Decode(&credential)
	return credential, err
}

func (r CredentialRepository) getCredentialMap(filter func(credential Credential) bool) map[string]Credential {
	bytesList, _ := r.common.getList(r.credentialBucket)
	credentialMap := make(map[string]Credential)
	for _, el := range bytesList {
		var credential Credential
		buff := bytes.NewBuffer(el.value)
		_ = gob.NewDecoder(buff).Decode(&credential)

		// hide password
		credential.Password = "configured"

		// filter elements in the list by lambda
		if filter == nil || filter(credential) {
			credentialMap[el.key] = credential
		}
	}
	return credentialMap
}
