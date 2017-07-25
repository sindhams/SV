/*Copyright (c) 2015-2016 wavemaker-com All Rights Reserved.This software is the confidential and proprietary information of wavemaker-com You shall not disclose such Confidential Information and shall use it only in accordance with the terms of the source code license agreement you entered into with wavemaker-com*/
package com.salesvision2_0.adventureworks2014.service;

/*This is a Studio Managed File. DO NOT EDIT THIS FILE. Your changes may be reverted by Studio.*/

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wavemaker.runtime.data.dao.WMGenericDao;
import com.wavemaker.runtime.data.exception.EntityNotFoundException;
import com.wavemaker.runtime.data.export.ExportType;
import com.wavemaker.runtime.data.expression.QueryFilter;
import com.wavemaker.runtime.data.model.AggregationInfo;
import com.wavemaker.runtime.file.model.Downloadable;

import com.salesvision2_0.adventureworks2014.VjobCandidateEducation;
import com.salesvision2_0.adventureworks2014.VjobCandidateEducationId;


/**
 * ServiceImpl object for domain model class VjobCandidateEducation.
 *
 * @see VjobCandidateEducation
 */
@Service("AdventureWorks2014.VjobCandidateEducationService")
public class VjobCandidateEducationServiceImpl implements VjobCandidateEducationService {

    private static final Logger LOGGER = LoggerFactory.getLogger(VjobCandidateEducationServiceImpl.class);


    @Autowired
    @Qualifier("AdventureWorks2014.VjobCandidateEducationDao")
    private WMGenericDao<VjobCandidateEducation, VjobCandidateEducationId> wmGenericDao;

    public void setWMGenericDao(WMGenericDao<VjobCandidateEducation, VjobCandidateEducationId> wmGenericDao) {
        this.wmGenericDao = wmGenericDao;
    }

    @Transactional(value = "AdventureWorks2014TransactionManager")
    @Override
	public VjobCandidateEducation create(VjobCandidateEducation vjobCandidateEducation) {
        LOGGER.debug("Creating a new VjobCandidateEducation with information: {}", vjobCandidateEducation);
        VjobCandidateEducation vjobCandidateEducationCreated = this.wmGenericDao.create(vjobCandidateEducation);
        return vjobCandidateEducationCreated;
    }

	@Transactional(readOnly = true, value = "AdventureWorks2014TransactionManager")
	@Override
	public VjobCandidateEducation getById(VjobCandidateEducationId vjobcandidateeducationId) throws EntityNotFoundException {
        LOGGER.debug("Finding VjobCandidateEducation by id: {}", vjobcandidateeducationId);
        VjobCandidateEducation vjobCandidateEducation = this.wmGenericDao.findById(vjobcandidateeducationId);
        if (vjobCandidateEducation == null){
            LOGGER.debug("No VjobCandidateEducation found with id: {}", vjobcandidateeducationId);
            throw new EntityNotFoundException(String.valueOf(vjobcandidateeducationId));
        }
        return vjobCandidateEducation;
    }

    @Transactional(readOnly = true, value = "AdventureWorks2014TransactionManager")
	@Override
	public VjobCandidateEducation findById(VjobCandidateEducationId vjobcandidateeducationId) {
        LOGGER.debug("Finding VjobCandidateEducation by id: {}", vjobcandidateeducationId);
        return this.wmGenericDao.findById(vjobcandidateeducationId);
    }


	@Transactional(rollbackFor = EntityNotFoundException.class, value = "AdventureWorks2014TransactionManager")
	@Override
	public VjobCandidateEducation update(VjobCandidateEducation vjobCandidateEducation) throws EntityNotFoundException {
        LOGGER.debug("Updating VjobCandidateEducation with information: {}", vjobCandidateEducation);
        this.wmGenericDao.update(vjobCandidateEducation);

        VjobCandidateEducationId vjobcandidateeducationId = new VjobCandidateEducationId();
        vjobcandidateeducationId.setJobCandidateId(vjobCandidateEducation.getJobCandidateId());
        vjobcandidateeducationId.setEdu_level(vjobCandidateEducation.getEdu_level());
        vjobcandidateeducationId.setEdu_startDate(vjobCandidateEducation.getEdu_startDate());
        vjobcandidateeducationId.setEdu_endDate(vjobCandidateEducation.getEdu_endDate());
        vjobcandidateeducationId.setEdu_degree(vjobCandidateEducation.getEdu_degree());
        vjobcandidateeducationId.setEdu_major(vjobCandidateEducation.getEdu_major());
        vjobcandidateeducationId.setEdu_minor(vjobCandidateEducation.getEdu_minor());
        vjobcandidateeducationId.setEdu_gpa(vjobCandidateEducation.getEdu_gpa());
        vjobcandidateeducationId.setEdu_gpascale(vjobCandidateEducation.getEdu_gpascale());
        vjobcandidateeducationId.setEdu_school(vjobCandidateEducation.getEdu_school());
        vjobcandidateeducationId.setEdu_loc_countryRegion(vjobCandidateEducation.getEdu_loc_countryRegion());
        vjobcandidateeducationId.setEdu_loc_state(vjobCandidateEducation.getEdu_loc_state());
        vjobcandidateeducationId.setEdu_loc_city(vjobCandidateEducation.getEdu_loc_city());

        return this.wmGenericDao.findById(vjobcandidateeducationId);
    }

    @Transactional(value = "AdventureWorks2014TransactionManager")
	@Override
	public VjobCandidateEducation delete(VjobCandidateEducationId vjobcandidateeducationId) throws EntityNotFoundException {
        LOGGER.debug("Deleting VjobCandidateEducation with id: {}", vjobcandidateeducationId);
        VjobCandidateEducation deleted = this.wmGenericDao.findById(vjobcandidateeducationId);
        if (deleted == null) {
            LOGGER.debug("No VjobCandidateEducation found with id: {}", vjobcandidateeducationId);
            throw new EntityNotFoundException(String.valueOf(vjobcandidateeducationId));
        }
        this.wmGenericDao.delete(deleted);
        return deleted;
    }

	@Transactional(readOnly = true, value = "AdventureWorks2014TransactionManager")
	@Override
	public Page<VjobCandidateEducation> findAll(QueryFilter[] queryFilters, Pageable pageable) {
        LOGGER.debug("Finding all VjobCandidateEducations");
        return this.wmGenericDao.search(queryFilters, pageable);
    }

    @Transactional(readOnly = true, value = "AdventureWorks2014TransactionManager")
    @Override
    public Page<VjobCandidateEducation> findAll(String query, Pageable pageable) {
        LOGGER.debug("Finding all VjobCandidateEducations");
        return this.wmGenericDao.searchByQuery(query, pageable);
    }

    @Transactional(readOnly = true, value = "AdventureWorks2014TransactionManager")
    @Override
    public Downloadable export(ExportType exportType, String query, Pageable pageable) {
        LOGGER.debug("exporting data in the service AdventureWorks2014 for table VjobCandidateEducation to {} format", exportType);
        return this.wmGenericDao.export(exportType, query, pageable);
    }

	@Transactional(readOnly = true, value = "AdventureWorks2014TransactionManager")
	@Override
	public long count(String query) {
        return this.wmGenericDao.count(query);
    }

    @Transactional(readOnly = true, value = "AdventureWorks2014TransactionManager")
	@Override
    public Page<Map<String, Object>> getAggregatedValues(AggregationInfo aggregationInfo, Pageable pageable) {
        return this.wmGenericDao.getAggregatedValues(aggregationInfo, pageable);
    }



}

